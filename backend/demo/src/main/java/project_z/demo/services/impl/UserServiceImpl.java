package project_z.demo.services.impl;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import project_z.demo.JavaUtil.BeanUtilsHelper;
import project_z.demo.entity.RoomEntity;
import project_z.demo.entity.UserEntity;
import project_z.demo.repositories.RoomRepository;
import project_z.demo.repositories.TitleRepository;
import project_z.demo.repositories.UserRepository;
import project_z.demo.services.UserService;

@Service
public class UserServiceImpl implements UserService {

    private final TitleRepository titleRepository;
    @Autowired
    private BeanUtilsHelper beanUtilsHelper;
    private UserRepository userRepository;
    @Autowired
    private RoomRepository roomRepository;
    public UserServiceImpl(UserRepository userRepository, TitleRepository titleRepository){
        this.userRepository = userRepository;
        this.titleRepository = titleRepository;
    }
@Override
public UserEntity save(UserEntity userEntity){
    return userRepository.save(userEntity);
    
}
@Override 
public Optional<UserEntity> findOne(UUID id){

return  userRepository.findById(id);
}
@Override
public boolean isExists(UUID id) {
    return userRepository.existsById(id);
}
@Override
public UserEntity partialUpdate(UUID id, UserEntity source) {
    return userRepository.findById(id)
        .map(target -> {
            beanUtilsHelper.copyNonNullProperties(source, target);
            return userRepository.save(target);
        })
        .orElseThrow(() -> new RuntimeException("User not found"));
}
@Override
public void deleteById(UUID id){
     UserEntity user = userRepository.findById(id)
        .orElseThrow(() -> new RuntimeException("User not found"));
    for (RoomEntity room : user.getRooms()) {
        room.getMembers().remove(user);
        roomRepository.save(room); 
    }
    user.getRooms().clear();
    userRepository.deleteById(id);
}
@Override
public Optional<UserEntity> findByNameTag(String nameTag){
    return userRepository.findByNameTag(nameTag);
}
@Override 
public String uploadAvatar(UserEntity userEntity, MultipartFile file){
        List<String> allowedContentTypes = List.of(
        "image/jpeg",
        "image/png",
        "image/gif"
    );
    RestTemplate  restTemplate = new RestTemplate();
    String serviceRoleKey = System.getenv("SUPABASE_SERVICE_ROLE");
    String contentType = file.getContentType();
    if (!allowedContentTypes.contains(contentType)) {
        return "Error: Unsupported file type. Only JPEG, PNG, and GIF are allowed.";
    }
    String oldImgUrl =  userEntity.getImg();
    HttpHeaders deleteHeaders = new HttpHeaders();
    String ProjectURL = "https://lzezevzurvipsnnwsemc.storage.supabase.co/storage/v1/object/";
    String bucket = "Avatars";
    String originalFilename = file.getOriginalFilename();
    String safeFilename = originalFilename.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
    String fileName = UUID.randomUUID() + "-" + safeFilename;
    String url =  ProjectURL +  bucket  +"/"+ fileName;
    HttpHeaders headers = new HttpHeaders();
    
    headers.setContentType(MediaType.parseMediaType(file.getContentType()));
    headers.set("Authorization", "Bearer " + serviceRoleKey);
    try {
        HttpEntity<byte[]> requestEntity = new HttpEntity<>(file.getBytes(), headers);
        restTemplate.exchange(url, HttpMethod.PUT, requestEntity, String.class);
    } catch (IOException e) {
        e.printStackTrace();
        return "Error uploading file: " + e.getMessage();
    }
        HttpEntity<String> deleteEntity = new HttpEntity<>(headers);
     try {
            restTemplate.exchange(oldImgUrl, HttpMethod.DELETE, deleteEntity, String.class);
        } catch (Exception e) {
            System.out.println("Warning: failed to delete old avatar: " + e.getMessage());
        }
    return ProjectURL + bucket + "/" + fileName;
}
    @Override
    public List<UserEntity> findByName(String name){
        return userRepository.findByNameIgnoreCase(name);
    }
}

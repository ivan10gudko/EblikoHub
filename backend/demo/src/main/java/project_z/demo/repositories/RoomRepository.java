package project_z.demo.repositories;

import java.util.List;
import java.util.UUID;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import project_z.demo.entity.RoomEntity;
@Repository
public interface  RoomRepository extends CrudRepository<RoomEntity, Long>{
 List<RoomEntity> findAllByMembers_UserId(UUID userId);
 
}

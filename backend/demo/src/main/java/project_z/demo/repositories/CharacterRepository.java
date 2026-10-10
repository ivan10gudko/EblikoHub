package project_z.demo.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;
import project_z.demo.entity.CharacterEntity;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CharacterRepository extends JpaRepository<CharacterEntity, UUID>, JpaSpecificationExecutor<CharacterEntity> {

    Optional<CharacterEntity> findByIdAndUser_UserId(UUID id, UUID userId);

    Page<CharacterEntity> findByNameContainingIgnoreCaseAndUser_UserId(String name, UUID userId, Pageable pageable);

    Page<CharacterEntity> findAllByUser_UserId(UUID userId, Pageable pageable);

    boolean existsByApiIdAndUser_UserId(Integer apiId, UUID userId);
}

package project_z.demo.Mappers.impl;

import org.springframework.stereotype.Component;

import project_z.demo.Mappers.Mapper;
import project_z.demo.entity.TitleEntity;
import project_z.demo.enums.TitleStatus;

@Component
public class EnumMapperImpl implements Mapper <TitleStatus, String> {
 
@Override
public String mapTo(TitleStatus source) {
    return source == null ? null :  source.name();
}

@Override 
public TitleStatus mapFrom(String destination){
    return destination == null ? null : TitleStatus.valueOf(destination);
}
}
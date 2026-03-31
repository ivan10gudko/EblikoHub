package project_z.demo.JavaUtil;

import java.beans.PropertyDescriptor;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.BeanWrapper;
import org.springframework.beans.BeanWrapperImpl;
import org.springframework.stereotype.Component;
@Component
public class BeanUtilsHelper {
public void copyNonNullProperties(Object src, Object target) {
    BeanUtils.copyProperties(src, target, getNullPropertyNames(src));
}

public String[] getNullPropertyNames(Object source) {
    final BeanWrapper src = new BeanWrapperImpl(source);
    PropertyDescriptor[] pds = src.getPropertyDescriptors();

    Set<String> ignoreNames = new HashSet<>();
    for (PropertyDescriptor pd : pds) {
        Object srcValue = src.getPropertyValue(pd.getName());
        
        if (srcValue == null) {
            ignoreNames.add(pd.getName());
        } 
        else if (Collection.class.isAssignableFrom(pd.getPropertyType())) {
            ignoreNames.add(pd.getName());
        }
    }
    return ignoreNames.toArray(new String[0]);
}
}

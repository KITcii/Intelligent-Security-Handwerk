package ish.user.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import ish.user.util.SortJsonDeserializer;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.data.domain.Sort;

@TestConfiguration
public class TestJacksonConfig {

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.addMixIn(Sort.class, SortJsonDeserializer.SortMixin.class);
        return mapper;
    }
}
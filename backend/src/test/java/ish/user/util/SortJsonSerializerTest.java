package ish.user.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.data.domain.Sort;

import static org.junit.jupiter.api.Assertions.assertEquals;

@JsonTest
class SortJsonSerializerTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testSerialize() throws JsonProcessingException {
        Sort.Order order = Sort.Order.asc("keyword");
        Sort sort = Sort.by(order);

        String json = "[{\"direction\":\"ASC\",\"property\":\"keyword\",\"ignoreCase\":false,\"nullHandling\":\"NATIVE\",\"ascending\":true,\"descending\":false}]";
        assertEquals(json, objectMapper.writeValueAsString(sort));
    }

    @Test
    void testSerializeWithMultipleOrders() throws JsonProcessingException {
        Sort.Order first = Sort.Order.asc("keyword");
        Sort.Order second = new Sort.Order(Sort.Direction.DESC, "synonym", true, Sort.NullHandling.NULLS_FIRST);
        Sort sort = Sort.by(first, second);

        String json = "[{\"direction\":\"ASC\",\"property\":\"keyword\",\"ignoreCase\":false,\"nullHandling\":\"NATIVE\",\"ascending\":true,\"descending\":false}," +
                "{\"direction\":\"DESC\",\"property\":\"synonym\",\"ignoreCase\":true,\"nullHandling\":\"NULLS_FIRST\",\"ascending\":false,\"descending\":true}]";
        assertEquals(json, objectMapper.writeValueAsString(sort));
    }
}
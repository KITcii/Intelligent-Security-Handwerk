package ish.user.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import ish.user.config.TestJacksonConfig;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.json.JsonTest;
import org.springframework.context.annotation.Import;
import org.springframework.data.domain.Sort;

import static org.junit.jupiter.api.Assertions.*;
@JsonTest
@Import(TestJacksonConfig.class)
class SortJsonDeserializerTest {

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testMapperConfiguration() {
        assertNotNull(objectMapper.findMixInClassFor(Sort.class), "Mixin not applied!");
    }

    @Test
    void testDeserialize() throws JsonProcessingException {
        String json =
                """
                [
                    {
                        "direction": "ASC",
                        "property": "keyword",
                        "ignoreCase": false,
                        "nullHandling": "NATIVE",
                        "ascending": true,
                        "descending": false
                    }
                ]
                """;
        Sort sort = objectMapper.readValue(json, Sort.class);

        Sort.Order keyword = sort.getOrderFor("keyword");
        assertNotNull(keyword);
        assertEquals(Sort.Direction.ASC, keyword.getDirection());
        assertTrue(keyword.isAscending());
    }

    @Test
    void testSerializeWithMultipleOrders() throws JsonProcessingException {
        String json =
                """
                [
                    {
                        "direction": "ASC",
                        "property": "keyword",
                        "ignoreCase": false,
                        "nullHandling": "NATIVE",
                        "ascending": true,
                        "descending": false
                    },
                    {
                        "direction": "DESC",
                        "property": "synonym",
                        "ignoreCase": true,
                        "nullHandling": "NULLS_FIRST"
                    }
                ]
                """;
        Sort sort = objectMapper.readValue(json, Sort.class);

        Sort.Order synonym = sort.getOrderFor("synonym");
        assertNotNull(synonym);
        assertEquals(Sort.Direction.DESC, synonym.getDirection());
        assertTrue(synonym.isDescending());
        assertFalse(synonym.isAscending());
        assertEquals(Sort.NullHandling.NULLS_FIRST, synonym.getNullHandling());

        Sort.Order keyword = sort.getOrderFor("keyword");
        assertNotNull(keyword);
    }


}
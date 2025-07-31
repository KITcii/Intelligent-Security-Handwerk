package ish.user.util;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import org.springframework.data.domain.Sort;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class SortJsonDeserializer extends JsonDeserializer<Sort> {
    @Override
    public Sort deserialize(JsonParser p, DeserializationContext ctxt) throws IOException, JacksonException {
        JsonNode node = p.getCodec().readTree(p);

        List<Sort.Order> orders = new ArrayList<>();
        if (node.isArray()) {
            for (JsonNode orderNode : node) {

                Sort.Direction direction = Sort.Direction.ASC;
                String property = null;
                boolean ignoreCase = false;
                Sort.NullHandling nullHandling = Sort.NullHandling.NATIVE;

                if (orderNode.has("direction"))
                    direction = Sort.Direction.valueOf(orderNode.get("direction").asText().toUpperCase());

                if (orderNode.has("property"))
                    property = orderNode.get("property").asText();

                if (orderNode.has("ignoreCase"))
                    ignoreCase = orderNode.get("ignoreCase").asBoolean();

                if (orderNode.has("nullHandling"))
                    nullHandling = Sort.NullHandling.valueOf(orderNode.get("nullHandling").asText().toUpperCase());

                if (property != null)
                    orders.add(new Sort.Order(direction, property, ignoreCase, nullHandling));
            }
        }

        return orders.isEmpty() ? Sort.unsorted() : Sort.by(orders);
    }

    @JsonDeserialize(using = SortJsonDeserializer.class)
    public static abstract class SortMixin {
    }
}

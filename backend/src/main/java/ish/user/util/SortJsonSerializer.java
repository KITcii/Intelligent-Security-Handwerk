package ish.user.util;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import org.springframework.boot.jackson.JsonComponent;
import org.springframework.data.domain.Sort;

import java.io.IOException;

@JsonComponent
public class SortJsonSerializer extends JsonSerializer<Sort> {

    @Override
    public void serialize(Sort value, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeStartArray();

        var it = value.stream().iterator();
        while (it.hasNext()) {
            var order = it.next();

            gen.writeStartObject();
            gen.writeFieldName("direction");
            gen.writeObject(order.getDirection());

            gen.writeFieldName("property");
            gen.writeObject(order.getProperty());

            gen.writeFieldName("ignoreCase");
            gen.writeObject(order.isIgnoreCase());

            gen.writeFieldName("nullHandling");
            gen.writeObject(order.getNullHandling());

            gen.writeFieldName("ascending");
            gen.writeObject(order.isAscending());

            gen.writeFieldName("descending");
            gen.writeObject(order.isDescending());
            gen.writeEndObject();
        }

        /*
        // this messes up order of ascending and descending
        value.iterator().forEachRemaining(v -> {
            try {
                gen.writeObject(v);
            } catch (IOException e) {
                e.printStackTrace();
            }
        });
         */

        gen.writeEndArray();
    }

    @Override
    public Class<Sort> handledType() {
        return Sort.class;
    }
}
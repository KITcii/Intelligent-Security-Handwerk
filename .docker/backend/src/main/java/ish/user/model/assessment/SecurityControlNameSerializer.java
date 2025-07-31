package ish.user.model.assessment;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import ish.user.model.knowledge.SecurityControl;

import java.io.IOException;
import java.util.List;

public class SecurityControlNameSerializer extends JsonSerializer<List<SecurityControl>> {
    @Override
    public void serialize(List<SecurityControl> controls, JsonGenerator gen, SerializerProvider serializers) throws IOException {
        gen.writeStartArray();

        for (SecurityControl control : controls) {
            gen.writeString(control.getName());
        }

        gen.writeEndArray();
    }
}
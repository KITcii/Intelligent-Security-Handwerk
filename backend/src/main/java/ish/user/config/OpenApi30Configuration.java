package ish.user.config;

import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.models.media.*;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

// https://www.baeldung.com/openapi-jwt-authentication
@Configuration
@SecurityScheme(
        name = "Bearer Authentication",
        type = SecuritySchemeType.HTTP,
        bearerFormat = "JWT",
        scheme = "bearer"
)
public class OpenApi30Configuration {

    @Bean
    public OpenApiCustomizer sortSchemaCustomizer() {
        return openApi -> {
            var schemas = openApi.getComponents().getSchemas();

            // Define the Order schema
            Schema<?> orderSchema = new ObjectSchema()
                    .addProperty("direction", new StringSchema()._enum(List.of("ASC", "DESC")).description("Sort direction"))
                    .addProperty("property", new StringSchema().description("Property to sort by"))
                    .addProperty("ignoreCase", new BooleanSchema().description("Whether to ignore case"))
                    .addProperty("nullHandling", new StringSchema()._enum(List.of("NATIVE", "NULLS_FIRST", "NULLS_LAST")).description("Null handling strategy"))
                    .addProperty("ascending", new BooleanSchema().description("Whether the sort is ascending. Use 'direction' for setting."))
                    .addProperty("descending", new BooleanSchema().description("Whether the sort is descending. Use 'direction' for setting."));

            // Specify required properties
            orderSchema.setRequired(List.of("direction", "property"));
            schemas.put("OrderObject", orderSchema);

            // Define the Sort schema as an array of Order
            ArraySchema sortSchema = new ArraySchema()
                    .items(new Schema<>().$ref("#/components/schemas/OrderObject"));
            schemas.put("SortObject", sortSchema);

            // Define the PageableObject schema
            // Use with ref attribute in annotation like below:
            // @Schema(description = "Pagination information", ref = "#/components/schemas/PageableObject")
            Schema<?> pageableSchema = new ObjectSchema()
                    .addProperty("sort", new Schema<>().$ref("#/components/schemas/SortObject"))
                    .addProperty("offSet", new IntegerSchema())
                    .addProperty("pageNumber", new IntegerSchema())
                    .addProperty("pageSize", new IntegerSchema())
                    .addProperty("unpaged", new BooleanSchema())
                    .addProperty("paged", new BooleanSchema());

            // Specify required properties
            pageableSchema.setRequired(List.of("pageNumber", "pageSize"));
            schemas.put("PageableObject", pageableSchema);
        };
    }

}

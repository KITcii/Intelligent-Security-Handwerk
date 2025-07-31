package ish.user.model;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Company type information", enumAsRef = true)
public enum CompanyType {

    /**
     * Corresponds to German "Kleinstbetrieb"
     */
    @Schema(description = "For companies with less than 10 employees")
    MICRO(10, "<="),

    /**
     * Corresponds to German "Kleinbetrieb"
     */
    @Schema(description = "For companies with less than 50 employees")
    SMALL(50, "<="),

    /**
     * Corresponds to German "Mittelbetrieb"
     */
    @Schema(description = "For companies with less than 250 employees")
    MEDIUM(250, "<="),

    /**
     * Corresponds to German "Großbetrieb"
     */
    @Schema(description = "For companies with more than 250 employees")
    LARGE(250, ">");

    private final int headCount;

    private final String comparator;

    private CompanyType(int headCount, String comparator) {
        this.headCount = headCount;
        this.comparator = comparator;
    }

    public int getHeadCount() {
        return headCount;
    }

    public String getComparator() {
        return comparator;
    }
}

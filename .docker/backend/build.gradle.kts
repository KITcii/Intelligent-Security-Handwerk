import java.io.File

plugins {
	id("java")
	id("org.springframework.boot") version "3.1.2"
	id("io.spring.dependency-management") version "1.1.2"
	id("io.freefair.lombok") version "8.10.2"
	id("org.flywaydb.flyway") version "9.16.3"
}

fun loadEnvVariables(): Map<String, String> {
	val envFile = File(".env")

	// If .env file does not exist, return only system environment variables
	if (!envFile.exists()) {
		return System.getenv()
	}

	val envMap = mutableMapOf<String, String>()

	envFile.readLines()
			.filter { it.isNotBlank() && !it.startsWith("#") }
			.forEach { line ->
				val parts = line.split("=", limit = 2)
				if (parts.size == 2) {
					val key = parts[0].trim()
					val value = parts[1].trim()

					// Add to map only if not already in system environment
					if (System.getenv(key) == null) {
						envMap[key] = value
					}
				}
			}

	// Return system environment variables + only missing .env values
	return System.getenv() + envMap
}

// Load the environment variables
val envVars = loadEnvVariables()

buildscript {
	dependencies {
		classpath("org.flywaydb:flyway-mysql:9.16.3")
	}
}

apply(plugin = "io.spring.dependency-management")

group = "ish"
version = "0.0.1-SNAPSHOT"

java {
	sourceCompatibility = JavaVersion.VERSION_17
	targetCompatibility = JavaVersion.VERSION_17
}

repositories {
	mavenCentral()
}

dependencies {
	implementation("org.springframework.boot:spring-boot-starter-web")
	implementation("org.springframework.boot:spring-boot-starter-data-jpa")
	implementation("org.springframework.boot:spring-boot-starter-security")

	implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.2.0")
	implementation("org.springframework.boot:spring-boot-starter-actuator")
	implementation("org.springframework.boot:spring-boot-starter-mail")
	implementation("org.springframework.boot:spring-boot-starter-thymeleaf")
	//developmentOnly("org.springframework.boot:spring-boot-docker-compose")

	implementation("com.google.guava:guava:32.1.2-jre")

	implementation("org.flywaydb:flyway-core:9.16.3")
	runtimeOnly("com.h2database:h2")
	runtimeOnly("org.mariadb.jdbc:mariadb-java-client:3.1.4")
	implementation("org.flywaydb:flyway-mysql:9.16.3")

	implementation("io.jsonwebtoken:jjwt-api:0.12.3")
	runtimeOnly("io.jsonwebtoken:jjwt-impl:0.12.3")
	runtimeOnly("io.jsonwebtoken:jjwt-jackson:0.12.3")

	testRuntimeOnly("com.h2database:h2")
	testImplementation("org.springframework.boot:spring-boot-starter-test")
	testImplementation("org.springframework.security:spring-security-test")
	testImplementation(platform("org.junit:junit-bom:5.10.0"))
	testImplementation("org.junit.jupiter:junit-jupiter")
}

tasks.withType<Test> {
	useJUnitPlatform()
}

// Print loaded environment variables for debugging
tasks.register("printEnvVars") {
	doLast {
		println("=== Loaded Environment Variables ===")
		envVars.forEach { (key, value) ->
			val maskedValue = if (key.contains("PASSWORD", ignoreCase = true)) value.replace(Regex("."), "*") else value
			println("$key: $maskedValue")
		}
	}
}

flyway {
	driver = envVars["DB_DRIVER"]
	url = envVars["DB_URL"]
	user = envVars["DB_USER"]
	password = envVars["DB_PASSWORD"]
	schemas = arrayOf(envVars["DB_SCHEMAS"])
	locations = arrayOf("classpath:db/migration")
	cleanDisabled = false
	placeholders = mapOf("identity_syntax" to envVars["FLYWAY_IDENTITY_SYNTAX"])
}

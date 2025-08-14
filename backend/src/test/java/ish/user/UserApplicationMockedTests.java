package ish.user;

import com.fasterxml.jackson.databind.ObjectMapper;
import ish.user.config.TestSecurityConfiguration;
import ish.user.controller.UserController;
import ish.user.controller.util.UserExtractor;
import ish.user.dto.UserDtoDetailed;
import ish.user.model.Company;
import ish.user.model.Role;
import ish.user.model.User;
import ish.user.model.security.JwtToken;
import ish.user.repository.*;
import ish.user.repository.location.LocationRepository;
import ish.user.repository.security.JwtTokenRepository;
import ish.user.service.notification.NotificationService;
import ish.user.service.security.UserTokenService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.Optional;
import java.util.Set;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// disables Spring Security Filters and, thus, allows testing without regard for security configuration
@AutoConfigureMockMvc(addFilters = false)
@Import(TestSecurityConfiguration.class)
@WebMvcTest(UserController.class)
class UserApplicationMockedTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private ObjectMapper objectMapper;

    /*
	@InjectMocks
	private UserController controller;
	*/

	//TODO Change this to UserService once it is implemented
	@MockBean
	private UserRepository userRepository;

	@MockBean
	private RoleRepository roleRepository;

	@MockBean
	private CompanyRepository companyRepository;

	@MockBean
	private LocationRepository locationRepository;

	@MockBean
	private ProfessionRepository professionRepository;

	@MockBean
	private UserTokenService userTokenService;

	@MockBean
	private JwtTokenRepository jwtTokenRepository;

	@MockBean
	private PasswordEncoder passwordEncoder;

	@MockBean
	private UserExtractor userExtractor;

	@MockBean
	private NotificationService notificationService;

	@Test
	void testGetUserById() throws Exception {
		Company c = new Company();
		c.setId(1);
		c.setUsers(Collections.emptyList());

		User user = new User("mitch.lee@hedberg.com", "Mitchell", "Hedberg");
		user.setRoles(Set.of(new Role("ADMIN")));
		user.setId(100);
		user.setCompany(c);

		when(userRepository.findById(Mockito.anyLong())).thenAnswer(
				invocation -> invocation.getArgument(0, Long.class) == user.getId() ? Optional.of(user) : Optional.empty()
		);

		/*
		JwtToken token = new JwtToken();
		token.setUser(user);
		when(jwtTokenRepository.findByToken(Mockito.anyString())).thenAnswer(
				invocation -> Optional.of(token)
		);
		 */

		when(userExtractor.fromSession(Mockito.any())).thenAnswer(
				invocation -> Optional.of(user)
		);

		/*
		mockMvc.perform(get("/api/v1.0/users/" + user.getId()))
				.andDo(print())
				.andExpect(status().isOk())
				.andExpect(content().contentType("application/json"))
				.andExpect(jsonPath("$.mail").value(user.getMail()))
				.andExpect(jsonPath("$.firstname").value(user.getFirstname()))
				.andExpect(jsonPath("$.lastname").value(user.getLastname()));
		*/

		UserDtoDetailed userDto = UserDtoDetailed.from(user);
		mockMvc.perform(get("/api/v1.0/users/" + user.getId()).header("Authorization", ""))
				.andDo(print())
				.andExpect(status().isOk())
				.andExpect(content().contentType("application/json"))
				.andExpect(content().json(objectMapper.writeValueAsString(userDto)));

		mockMvc.perform(get("/api/v1.0/users/" + (user.getId() + 1)).header("Authorization", ""))
				.andDo(print())
				.andExpect(status().isNotFound());
	}

}

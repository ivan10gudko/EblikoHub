package project_z.demo.controllers;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import com.fasterxml.jackson.databind.ObjectMapper;

import project_z.demo.TestDataUtil;
import project_z.demo.entity.UserEntity;

@SpringBootTest
@ExtendWith(SpringExtension.class)
@DirtiesContext(classMode= DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@AutoConfigureMockMvc
public class UserControllerIntegrationTests {
    @Autowired
    private MockMvc mockMvc;
    @Autowired
    private ObjectMapper objectMapper;
    @Test
    public void testThatCreateUserAndReturns201Created() throws Exception{
        UserEntity testUserA = TestDataUtil.createTestUserA();
        String userJson = objectMapper.writeValueAsString(testUserA);
        mockMvc.perform(
            MockMvcRequestBuilders.post("/Users")
            .contentType(MediaType.APPLICATION_JSON)
            .content(userJson)
        ).andExpect(
            MockMvcResultMatchers.status().isCreated()
        );
    }
        @Test
    public void testThatCreateUserAndReturnsCreatedUser() throws Exception{
        UserEntity testUserA = TestDataUtil.createTestUserA();
        String userJson = objectMapper.writeValueAsString(testUserA);
        mockMvc.perform(
            MockMvcRequestBuilders.post("/Users")
            .contentType(MediaType.APPLICATION_JSON)
            .content(userJson)
        ).andExpect(
            MockMvcResultMatchers.jsonPath("$.id").value("c91438ea-8288-4584-898b-c8a6c33a8e07")
        ).andExpect(
        MockMvcResultMatchers.jsonPath("$.name").value("Genadiy")
        ).andExpect(
            MockMvcResultMatchers.jsonPath("$.description").value("Natural")
        ).andExpect(
             MockMvcResultMatchers.jsonPath("$.img").value(52)
        ).andExpect(
            MockMvcResultMatchers.jsonPath("$.friendsList").isEmpty()
        ).andExpect(
            MockMvcResultMatchers.jsonPath("$.watchList").isEmpty()
        );
    }
}

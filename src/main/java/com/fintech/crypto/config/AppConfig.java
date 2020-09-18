package com.fintech.crypto.config;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fintech.crypto.prop.AppProp;
import com.fintech.crypto.task.MineCoin;
import com.mashape.unirest.http.ObjectMapper;
import com.mashape.unirest.http.Unirest;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Properties;

@Configuration
@EnableScheduling
public class AppConfig implements WebMvcConfigurer {

    @Autowired
    AppProp prop;

    @Autowired
    MineCoin mineCoin;

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**").allowedMethods("*").allowedOrigins("*");
    }

    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JavaMailSenderImpl getJavaMailSender() {

        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();

        Properties props = mailSender.getJavaMailProperties();
        props.put("mail.transport.protocol", "smtp");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.debug", "true");
        props.put("mail.smtp.ssl.trust", "*");

        return mailSender;
    }

    @Bean
    public void UnirestJsonConfig(){
        Unirest.setObjectMapper(new ObjectMapper() {
            com.fasterxml.jackson.databind.ObjectMapper mapper
                    = new com.fasterxml.jackson.databind.ObjectMapper();

            public String writeValue(Object value) {
                try {
                    return mapper.writeValueAsString(value);
                } catch (JsonProcessingException e) {
                    throw new RuntimeException(e);
                }
            }

            public <T> T readValue(String value, Class<T> valueType) {
                try {
                    return mapper.readValue(value, valueType);
                } catch (Exception e) {
                    throw new RuntimeException(e);
                }
            }
        });
    }

    //Every after every 4hr from now
    @Scheduled(fixedDelay = 14400000)
    public void scheduleMining() {
        mineCoin.mine();
    }

//    Every 5 mins for test cases
//    @Scheduled(fixedDelay = 60000)
//    public void scheduleMining2() {
//        mineCoin.mine();
//    }

}

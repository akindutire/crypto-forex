package com.fintech.crypto.security;


import com.fintech.crypto.context.DataLounge;
import com.fintech.crypto.prop.AppProp;
import com.fintech.crypto.service.domain.IUserSvc;
import io.jsonwebtoken.ExpiredJwtException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    @Autowired
    IUserSvc userSvc;

    @Autowired
    AppProp prop;

    @Autowired
    JwtProvider jwtProvider;

    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain) throws ServletException, IOException {
        //Get auth token through the Authorization header used
        final String tokenAndItsType = httpServletRequest.getHeader(prop.AUTH_HEADER_STRING);

        if ( tokenAndItsType == null || !tokenAndItsType.startsWith(prop.TOKEN_PREFIX) ){
            //Stop
            logger.warn("Authorization header is empty or must have a bearer token");
            filterChain.doFilter(httpServletRequest, httpServletResponse);
            return;
        }

        String token = tokenAndItsType.replace(prop.TOKEN_PREFIX, "");
        String username;
        try {
            username = jwtProvider.getUsernameFromToken(token);  // email
        }catch (ExpiredJwtException e){
            //Not placed into authorization context, it would be bounced by usernamepasswordfilter
            filterChain.doFilter(httpServletRequest, httpServletResponse);
            return;
        }

        if( !username.isEmpty() && SecurityContextHolder.getContext().getAuthentication() == null){

            UserDetails userDetails = userSvc.loadUserByUsername(username);

            if(jwtProvider.validateToken(token, userDetails)){
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                usernamePasswordAuthenticationToken
                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(httpServletRequest));
                // After setting the Authentication in the context, we specify
                // that the current user is authenticated. So it passes the
                // Spring Security Configurations successfully
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                //Save tag for lookup
                DataLounge.currentUserRecognizedByUniqueKey = userDetails.getUsername();
            }
        }
        filterChain.doFilter(httpServletRequest, httpServletResponse);
    }
}

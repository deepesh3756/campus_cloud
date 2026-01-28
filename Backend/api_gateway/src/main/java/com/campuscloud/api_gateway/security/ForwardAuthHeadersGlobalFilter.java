package com.campuscloud.api_gateway.security;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;

import reactor.core.publisher.Mono;

@Component
public class ForwardAuthHeadersGlobalFilter implements GlobalFilter, Ordered {

    private static final String HEADER_GATEWAY_AUTH = "X-Gateway-Auth";
    private static final String HEADER_AUTH_USERNAME = "X-Auth-Username";
    private static final String HEADER_AUTH_ROLES = "X-Auth-Roles";

    @Value("${gateway.auth.secret:}")
    private String gatewayAuthSecret;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {

        ServerHttpRequest sanitizedRequest = exchange.getRequest().mutate()
                .headers(headers -> {
                    headers.remove(HEADER_GATEWAY_AUTH);
                    headers.remove(HEADER_AUTH_USERNAME);
                    headers.remove(HEADER_AUTH_ROLES);
                })
                .build();

        ServerWebExchange sanitizedExchange = exchange.mutate().request(sanitizedRequest).build();

        if (gatewayAuthSecret == null || gatewayAuthSecret.isBlank()) {
            return chain.filter(sanitizedExchange);
        }

        return sanitizedExchange.getPrincipal()
                .flatMap(principal -> addAuthHeadersIfJwt(sanitizedExchange, chain, principal))
                .switchIfEmpty(chain.filter(sanitizedExchange));
    }

    private Mono<Void> addAuthHeadersIfJwt(
            ServerWebExchange exchange,
            GatewayFilterChain chain,
            Principal principal
    ) {

        if (!(principal instanceof JwtAuthenticationToken)) {
            return chain.filter(exchange);
        }

        JwtAuthenticationToken jwtAuth = (JwtAuthenticationToken) principal;

        Jwt jwt = jwtAuth.getToken();
        String username = jwt.getSubject();

        if (username == null || username.isBlank()) {
            return chain.filter(exchange);
        }

        List<String> roles = extractRoles(jwt.getClaims(), jwtAuth.getAuthorities());
        String rolesHeader = String.join(",", roles);

        ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                .headers(headers -> {
                    headers.remove(HEADER_GATEWAY_AUTH);
                    headers.remove(HEADER_AUTH_USERNAME);
                    headers.remove(HEADER_AUTH_ROLES);

                    headers.add(HEADER_GATEWAY_AUTH, gatewayAuthSecret);
                    headers.add(HEADER_AUTH_USERNAME, username);
                    if (!rolesHeader.isBlank()) {
                        headers.add(HEADER_AUTH_ROLES, rolesHeader);
                    }
                })
                .build();

        return chain.filter(exchange.mutate().request(mutatedRequest).build());
    }

    private List<String> extractRoles(Map<String, Object> claims, Collection<? extends GrantedAuthority> authorities) {
        List<String> roles = new ArrayList<>();

        Object roleClaim = claims.get("role");
        if (roleClaim instanceof String s && !s.isBlank()) {
            roles.add(s);
        }

        Object rolesClaim = claims.get("roles");
        if (rolesClaim instanceof Collection<?> c) {
            for (Object r : c) {
                if (r == null) {
                    continue;
                }
                String s = String.valueOf(r).trim();
                if (!s.isEmpty()) {
                    roles.add(s);
                }
            }
        }

        if (roles.isEmpty() && authorities != null) {
            roles.addAll(
                    authorities.stream()
                            .map(GrantedAuthority::getAuthority)
                            .collect(Collectors.toList())
            );
        }

        return roles;
    }

    @Override
    public int getOrder() {
        return Ordered.LOWEST_PRECEDENCE;
    }
}

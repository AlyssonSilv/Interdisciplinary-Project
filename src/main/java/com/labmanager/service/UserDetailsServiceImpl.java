package com.labmanager.service;

import com.labmanager.model.User;
import com.labmanager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * Implementação do UserDetailsService do Spring Security
 * Responsável por carregar dados do usuário para autenticação
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    
    @Autowired
    UserRepository userRepository;

    /**
     * Carrega um usuário pelo RA (username) para autenticação
     * Método chamado pelo Spring Security durante o processo de login
     * @param ra RA do usuário (usado como username)
     * @return UserDetails com informações do usuário e suas permissões
     * @throws UsernameNotFoundException se o usuário não for encontrado
     */
    @Override
    @Transactional
    public UserDetails loadUserByUsername(String ra) throws UsernameNotFoundException {
        // Busca o usuário no banco de dados pelo RA
        User user = userRepository.findByRa(ra)
                .orElseThrow(() -> new UsernameNotFoundException("Usuário não encontrado com RA: " + ra));

        // Converte o role do usuário para GrantedAuthority do Spring Security
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()));

        // Retorna um UserDetails com as informações do usuário
        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getRa()) // RA como username
                .password(user.getPassword()) // Senha criptografada
                .authorities(authorities) // Permissões baseadas no role
                .accountExpired(false)
                .accountLocked(!user.getActive()) // Conta bloqueada se usuário inativo
                .credentialsExpired(false)
                .disabled(!user.getActive()) // Usuário desabilitado se inativo
                .build();
    }
}

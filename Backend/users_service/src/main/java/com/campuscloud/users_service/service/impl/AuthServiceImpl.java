package com.campuscloud.users_service.service.impl;

import org.springframework.stereotype.Service;

import com.campuscloud.users_service.dto.AdminRegisterRequestDto;
import com.campuscloud.users_service.dto.LoginRequestDTO;
import com.campuscloud.users_service.dto.LoginResponseDTO;
import com.campuscloud.users_service.entity.Account;
import com.campuscloud.users_service.entity.Admin;
import com.campuscloud.users_service.entity.Gender;
import com.campuscloud.users_service.entity.Role;
import com.campuscloud.users_service.repository.AccountRepository;
import com.campuscloud.users_service.repository.AdminRepository;
import com.campuscloud.users_service.service.AuthService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService 
{
	private final AccountRepository accountRepository;
	private final AdminRepository adminRepository;


    @Transactional
    public LoginResponseDTO login(LoginRequestDTO request) {

        Account account = accountRepository.findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new RuntimeException("Invalid username or password"));

        if (!account.getIsActive()) {
            throw new RuntimeException("Account is disabled");
        }
        
        if (!account.getPasswordHash().equals(request.getPassword())) {
            throw new RuntimeException("Invalid username or password");
        }

        return new LoginResponseDTO(
                account.getUsername(),
                account.getRole().name()
        );
    }
    
    @Transactional
    public void registerAdmin(AdminRegisterRequestDto dto) {

        // 1️⃣ Check if username already exists
        if (accountRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        // 2️⃣ Create Account
        Account account = new Account();
        account.setUsername(dto.getUsername());
        account.setPasswordHash(dto.getPassword()); // plain-text (for now)
        account.setRole(Role.STUDENT);
        account.setIsActive(true);

        // 3️⃣ Save Account (account_id generated here)
        Account savedAccount = accountRepository.save(account);

        // 4️⃣ Create Admin profile
        Admin admin = new Admin();
        admin.setAccount(savedAccount);
        admin.setName(dto.getName());
        admin.setEmail(dto.getEmail());
        admin.setPhone(dto.getPhone());
        admin.setGender(Gender.valueOf(dto.getGender()));

        // 5️⃣ Save Admin
        adminRepository.save(admin);
    }
}

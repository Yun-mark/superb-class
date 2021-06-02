package com.lyh.admin.config.security;

import com.lyh.admin.config.ClassPathTldsLoader;
import com.lyh.admin.filters.CaptchaCodeFilter;
import com.lyh.admin.pojo.TUser;
import com.lyh.admin.service.IRbacService;
import com.lyh.admin.service.ITUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.web.servlet.ConditionalOnMissingFilterBean;
import org.springframework.context.annotation.Bean;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.WebSecurityConfigurer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.rememberme.JdbcTokenRepositoryImpl;
import org.springframework.security.web.authentication.rememberme.PersistentTokenRepository;

import javax.annotation.Resource;
import javax.sql.DataSource;
import java.util.List;
import java.util.stream.Collectors;

@SpringBootConfiguration
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {


    @Autowired
    private JxcAuthenticationFailedHandler jxcAuthenticationFailedHandler;
    @Autowired
    private JxcAuthenticationSuccessHandler jxcAuthenticationSuccessHandler;
    @Autowired
    private JxcLogoutSuccessHandler jxcLogoutSuccessHandler;
    @Resource
    private ITUserService userService;
    @Resource
    private CaptchaCodeFilter captchaCodeFilter;
    @Resource
    private DataSource dataSource;
    @Resource
    private IRbacService rbacService;
    /**
     * 放行静态资源
     * @param web
     * @throws Exception
     */
    @Override
    public void configure(WebSecurity web) throws Exception{
        web.ignoring().antMatchers("/css/**","/error/**","/images/**","/js/**","/lib/**");
    }


    /**
     * 配置登录退出界面
     * @param http
     * @throws Exception
     */
    @Override
    protected void configure(HttpSecurity http) throws Exception{
        //禁用csf
        http.csrf().disable()
                .addFilterBefore(captchaCodeFilter, UsernamePasswordAuthenticationFilter.class)
                //允许frame页面嵌套
                .headers().frameOptions().disable()
                .and()
                    .formLogin()
                    .usernameParameter("username")
                    .passwordParameter("password")
                    .loginPage("/index")
                    .loginProcessingUrl("/login")
                    .successHandler(jxcAuthenticationSuccessHandler)
                    .failureHandler(jxcAuthenticationFailedHandler)
                .and()
                    .logout()
                    .logoutUrl("/signout")
                    .deleteCookies("JSESSIONID")
                    .logoutSuccessHandler(jxcLogoutSuccessHandler)
                .and()
                    .rememberMe()
                    .rememberMeParameter("rememberMe")
                    //保存在浏览器端的cookie的名称,如果不设置默认也是remember-me
                    .rememberMeCookieName("remember-me-cookie")
                    //设置token的有效期,即多长时间内可以免除重复登录,单位是秒。
                    .tokenValiditySeconds(7 * 24 * 60 * 60)
                    //自定义
                    .tokenRepository(persistentTokenRepository())
                .and()
                    .authorizeRequests().antMatchers("/index","login","/image").permitAll()
                    .anyRequest().authenticated();
    }

    /**
     * 配置从数据库中获取token
     * @return
     */
    @Bean
    public PersistentTokenRepository persistentTokenRepository(){
        JdbcTokenRepositoryImpl tokenRepository = new JdbcTokenRepositoryImpl();
        tokenRepository.setDataSource(dataSource);
        return tokenRepository;
    }


    @Bean
    public UserDetailsService userDetailsService(){
        return new UserDetailsService() {
            @Override
            public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
                TUser UserDetails = userService.findTUserByUserName(username);
                /**
                 * 1.查询用户对应的角色
                 * 2.根据用户扮演的角色查询角色拥有的权限记录
                 */
                List<String> roleNames = rbacService.findRolesByUserName(username);
                List<String> authorities = rbacService.findAuthoritiesByRoleName(roleNames);

                roleNames = roleNames.stream().map(role-> "ROLE_"+role).collect(Collectors.toList());

                authorities.addAll(roleNames);
                UserDetails.setAuthorities(AuthorityUtils.commaSeparatedStringToAuthorityList(String.join(",",authorities)));
                return UserDetails;
            }
        };
    }

    @Bean
    public PasswordEncoder encoder(){
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception{
        auth.userDetailsService(userDetailsService()).passwordEncoder(encoder());
    }

    @Bean
    @ConditionalOnMissingBean(ClassPathTldsLoader.class)
    public ClassPathTldsLoader classPathTldsLoader(){
        return new ClassPathTldsLoader();
    }

}


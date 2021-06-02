package com.lyh.admin.service;

import com.lyh.admin.pojo.TUser;
import com.baomidou.mybatisplus.extension.service.IService;
import com.lyh.admin.query.UserQuery;

import javax.servlet.http.HttpSession;
import java.util.Map;

/**
 * <p>
 * 用户表 服务类
 * </p>
 *
 * @author 李毅恒
 * @since 2021-05-10
 */
public interface ITUserService extends IService<TUser> {

    /**
     *  用户登录方法
     * @param username
     * @param password
     * @param session
     * @return
     */


    /**
     * 根据用户名查询用户记录
     * @param username
     * @return
     */
    public TUser findTUserByUserName(String username);

    public void updateUserInfo(TUser user);

    void updateUserPassword(String userName, String oldPassword, String newPassword, String confirmPassword);

    Map<String, Object> userList(UserQuery userQuery);

    void saveUser(TUser user);

    void updateUser(TUser user);

    void deleteUser(Integer[] ids);

}


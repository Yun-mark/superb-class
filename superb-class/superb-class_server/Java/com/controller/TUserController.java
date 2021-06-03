package com.lyh.admin.controller;


import com.fasterxml.jackson.databind.Module;
import com.lyh.admin.exceptions.ParamsException;
import com.lyh.admin.model.RespBean;
import com.lyh.admin.pojo.TUser;
import com.lyh.admin.query.UserQuery;
import com.lyh.admin.service.ITUserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;

import java.security.Principal;
import java.util.Map;


/**
 * <p>
 * 用户表 前端控制器
 * </p>
 *
 * @author 李毅恒
 * @since 2021-05-10
 */

@RequestMapping("/user")
@Controller
public class TUserController {

    @Resource
    private ITUserService userService;

    /**
     * 用户信息设置页面
     * @return
     */
    @RequestMapping("setting")
    public String setting(Principal principal, Model model){
        TUser user =userService.findTUserByUserName(principal.getName());
        model.addAttribute("user",user);
        return "user/setting";
    }

    /**
     * 用户更新页面
     * @param user
     * @return
     */
    @RequestMapping("updateUserInfo")
    @ResponseBody
    public RespBean updateUserInfo(TUser user){
            userService.updateUserInfo(user);
            return RespBean.success("用户信息更新成功!");
    }

    /**
     * 密码修改更新页
     * @return
     */
    @RequestMapping("toPasswordPage")
    public String password(){
        return "user/password";
    }

    /**
     * 用户密码更新
     * @param principal
     * @param oldPassword
     * @param newPassword
     * @param confirmPassword
     * @return
     */
     @RequestMapping("updateUserPassword")
     @ResponseBody
     public RespBean updateUserPassword(Principal principal, String oldPassword, String newPassword, String confirmPassword){
             userService.updateUserPassword(principal.getName(),oldPassword,newPassword,confirmPassword);
             return RespBean.success("密码修改成功!");
     }

    /**
     * 用户管理主页
     * @return
     */
     @RequestMapping("index")
     @PreAuthorize("hasAnyAuthority('1010')")
     public String index(){
         return "user/user";
     }

    @RequestMapping("list")
    @ResponseBody
    @PreAuthorize("hasAnyAuthority('101003')")
     public Map<String,Object> userList(UserQuery userQuery){
         return userService.userList(userQuery);
     }

    /**
     * 添加|更新用户页面
     * @param id
     * @param model
     * @return
     */
     @RequestMapping("addOrUpdateUserPage")
     public String addOrUpdatePage(Integer id,Model model){
         if(null != id){
             model.addAttribute("user",userService.getById(id));
         }
         return "user/add_update";
   }

    /**
     * 用户信息添加接口
     * @param user
     * @return
     */
   @RequestMapping("save")
   @ResponseBody
   public RespBean saveUser(TUser user){
         userService.saveUser(user);
         return RespBean.success("用户信息添加成功!");
   }

    /**
     * 用户信息更新接口
     * @param user
     * @return
     */
    @RequestMapping("update")
    @ResponseBody
    public RespBean updateUser(TUser user){
        userService.updateUser(user);
        return RespBean.success("用户记录更新成功!");
    }

    /**
     * 用户记录删除接口
     * @param ids
     * @return
     */
    @RequestMapping("delete")
    @ResponseBody
    public  RespBean deleteUser(Integer[] ids){
        userService.deleteUser(ids);
        return RespBean.success("用户信息删除成功！");
    }

}

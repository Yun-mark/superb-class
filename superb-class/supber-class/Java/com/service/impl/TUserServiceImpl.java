package com.lyh.admin.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.lyh.admin.pojo.TUser;
import com.lyh.admin.mapper.TUserMapper;
import com.lyh.admin.pojo.TUserRole;
import com.lyh.admin.query.UserQuery;
import com.lyh.admin.service.ITUserRoleService;
import com.lyh.admin.service.ITUserService;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.lyh.admin.utils.AssertUtil;
import com.lyh.admin.utils.PageResultUtil;
import com.lyh.admin.utils.StringUtil;
import org.apache.commons.lang3.StringUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.*;

/**
 * <p>
 * 用户表 服务实现类
 * </p>
 *
 * @author 李毅恒
 * @since 2021-05-10
 */
@Service
public class TUserServiceImpl extends ServiceImpl<TUserMapper, TUser> implements ITUserService {

    @Resource
    private PasswordEncoder passwordEncoder;

    @Resource
    private ITUserRoleService userRoleService;


    /**
     * findTUserByUserName
     * @param username
     * @return
     */
    @Override
    public TUser findTUserByUserName(String username) {
        return this.baseMapper.selectOne(new QueryWrapper<TUser>().eq("is_del",0).eq("user_name",username));
    }

    /**
     * 更新用户信息
     * @param user
     */
    @Override
    @Transactional(propagation = Propagation.REQUIRED,rollbackFor = Exception.class)
    public void updateUserInfo(TUser user) {
        AssertUtil.isTrue(StringUtil.isEmpty(user.getUsername()),"用户名不为空!");
        TUser temp = this.findTUserByUserName(user.getUsername());
        AssertUtil.isTrue(null != temp && !(temp.getId().equals(user.getId())),"用户名已存在!");
        AssertUtil.isTrue(!(this.updateById(user)),"用户信息更新失败！");

    }

    /**
     * 修改密码
     * @param userName
     * @param oldPassword
     * @param newPassword
     * @param confirmPassword
     */
    @Override
    @Transactional(propagation = Propagation.REQUIRED,rollbackFor = Exception.class)
    public void updateUserPassword(String userName, String oldPassword, String newPassword, String confirmPassword) {
        TUser user = null;
        user = this.findTUserByUserName(userName);
        AssertUtil.isTrue(null == user,"用户名不存在或未登录!");
        AssertUtil.isTrue(StringUtil.isEmpty(oldPassword),"请输入原始密码!");
        AssertUtil.isTrue(StringUtil.isEmpty(newPassword),"请输入新密码!");
        AssertUtil.isTrue(StringUtil.isEmpty(confirmPassword),"请输入确认密码!");
        AssertUtil.isTrue(!(passwordEncoder.matches(oldPassword,user.getPassword())),"原始密码输入错误!");
        AssertUtil.isTrue(!(newPassword.equals(confirmPassword)),"密码输入不一致!");
        AssertUtil.isTrue(newPassword.equals(oldPassword),"新密码与原密码不能一致!");
        user.setPassword(passwordEncoder.encode(newPassword));
        AssertUtil.isTrue(!(this.updateById(user)),"用户密码更新失败!");
    }

    /**
     * 用户管理查询
     * @param userQuery
     * @return
     */
    @Override
    public Map<String, Object> userList(UserQuery userQuery) {
        IPage<TUser> page = new Page<TUser>(userQuery.getPage(),userQuery.getLimit());
        QueryWrapper<TUser> queryWrapper = new QueryWrapper<TUser>();
        queryWrapper.eq("is_del",0);
        if(StringUtils.isNotBlank(userQuery.getUserName())){
            queryWrapper.like("user_name",userQuery.getUserName());
        }

        page = this.baseMapper.selectPage(page,queryWrapper);
        return PageResultUtil.getResult(page.getTotal(),page.getRecords());
    }

    /**
     * 用户添加操作
     * @param user
     */
    @Override
    @Transactional(propagation = Propagation.REQUIRED,rollbackFor = Exception.class)
    public void saveUser(TUser user) {
        /**
         * 用户名
         *    非空  不可重复
         * 用户密码默认设置123456,后续自己改
         * 用户默认有效
         */

        AssertUtil.isTrue(StringUtils.isBlank(user.getUsername()),"用户名不能为空！");
        AssertUtil.isTrue(null != this.findTUserByUserName(user.getUsername()),"用户名已存在！");
        user.setPassword(passwordEncoder.encode("123456"));
        user.setIsDel(0);
        AssertUtil.isTrue(!(this.save(user)),"用户信息添加失败!");
        //重新查询用户记录
        TUser temp = this.findTUserByUserName(user.getUsername());
        /**
         *给用户分配角色
         */
        relationUserRole(temp.getId(),user.getRoleIds());
    }

    private void  relationUserRole(Integer userId,String roleIds){
        /**
         * 核心表 t_user_role
         * 添加时
         *   如果角色记录存在 执行批量添加
         * 更新时
         *   如果用户存在原始的角色记录
         *      如果存在 直接删除原来的角色记录 重新添加新的用户角色记录
         *
         *      如果不存在 直接执行添加即可
         *
         *      思路：
         *        首先查询用户原始的分配角色
         *            如果存在原始用户角色记录，直接删除（根据用户id），重新添加新的用户角色记录
         *            如果不存在，直接执行批量添加
         */
        int count = userRoleService.count(new QueryWrapper<TUserRole>().eq("user_id",userId));
        if (count > 0){
            AssertUtil.isTrue(!(userRoleService.remove(new QueryWrapper<TUserRole>().eq("user_id",userId))),"用户角色分配失败！");
        }
        if (StringUtils.isNotBlank(roleIds)){

            List<TUserRole> userRoles = new ArrayList<TUserRole>();
            for (String s : roleIds.split(",")) {
                 TUserRole userRole = new TUserRole();
                 userRole.setUserId(userId);
                 userRole.setRoleId(Integer.parseInt(s));
                 userRoles.add(userRole);
            }
            AssertUtil.isTrue(!(userRoleService.saveBatch(userRoles)),"用户角色分配失败！");;
        }
    }

    /**
     * 用户更新操作
     * @param user
     */
    @Override
    @Transactional(propagation = Propagation.REQUIRED,rollbackFor = Exception.class)
    public void updateUser(TUser user) {
        AssertUtil.isTrue(StringUtils.isBlank(user.getUsername()),"用户名不能为空！");
        TUser temp = this.findTUserByUserName(user.getUsername());
        AssertUtil.isTrue(null != temp && !(temp.getId().equals(user.getId())),"用户名已存在！");
        relationUserRole(user.getId(),user.getRoleIds());
        AssertUtil.isTrue(!(this.updateById(user)),"用户信息更新成功！");
    }

    /**
     * 用户删除操作
     * @param ids
     */
    @Override
    @Transactional(propagation = Propagation.REQUIRED,rollbackFor = Exception.class)
    public void deleteUser(Integer[] ids) {
        AssertUtil.isTrue(null == ids || ids.length == 0,"请选择待删除的记录id!");
        int count = userRoleService.count(new QueryWrapper<TUserRole>().in("user_id", Arrays.asList(ids)));
        if(count > 0){
            AssertUtil.isTrue(!(userRoleService.remove(new QueryWrapper<TUserRole>().in("user_id", Arrays.asList(ids)))),"用户记录删除失败！");
        }
        ArrayList<TUser> users = new ArrayList<>();
        for (Integer id : ids) {
            TUser temp = this.getById(id);
            temp.setIsDel(1);
            users.add(temp);
        }
        AssertUtil.isTrue(!(this.updateBatchById(users)),"用户记录删除失败！");
    }
}

<template>
  <div class="container">
    <div class="sidebar">
      <div class="profile">
        <div
          :style="`background-image: url('${getUserInfo.avatar}')`"
          :class="['avatar', { active: getFunction === 'avatar' }]"
          @click="setFunction('avatar')"
        ></div>
        <div class="name">{{ status.nickname }}</div>
      </div>
      <div class="function">
        <div
          :class="['cell', { active: getFunction === 'safe' }]"
          @click="setFunction('safe')"
        >
          帐号安全
        </div>
        <div
          :class="['cell', { active: getFunction === 'info' }]"
          @click="setFunction('info')"
        >
          个人信息
        </div>
        <div
          :class="['cell', { active: getFunction === 'authorization' }]"
          @click="setFunction('authorization')"
        >
          关联授权
        </div>
        <div
          :class="['cell', { active: getFunction === 'sync' }]"
          @click="setFunction('sync')"
        >
          同步管理
        </div>
      </div>
    </div>

    <div class="content">
      <div class="safe" v-show="getFunction === 'safe'">
        <div class="title">
          <div class="text-1">
            安全等级
            <span class="score">{{ status.score }}</span
            >分
          </div>
          <div class="progress">
            <Progress
              :percent="status.score"
              :stroke-color="getSafeColor()"
              hide-info
            />
          </div>
          <div
            class="text-2"
            :style="{ color: getSafeColor(), cursor: 'pointer' }"
            :title="getSafeNotice().title"
          ><Icon type="md-alert" />{{getSafeNotice().dec}}</div>
        </div>

        <div class="cell">
          <div class="icon">
            <span class="iconfont iconaccount_" />
          </div>
          <div class="text">
            <div class="text-1">
              {{ status.accountset ? "帐号：" + status.account : "未设置帐号" }}
              <span class="special" v-show="status.accountset == 0">
                <Icon type="md-alert" />未设置
              </span>
            </div>
            <div class="text-2">帐号用于帐号登录，以及论坛使用</div>
          </div>
          <div v-if="!status.accountset" class="button-box">
            <button
              class="button-primary"
              type="button"
              @click="handleCaptchaType('account')"
            >
              设置帐号
            </button>
          </div>
        </div>

        <div class="cell">
          <div class="icon">
            <span class="iconfont iconpassword_" />
          </div>
          <div class="text">
            <div class="text-1">
              帐号密码
              <span class="special" v-show="status.pdset == 0">
                <Icon type="md-alert" />未设置
              </span>
            </div>
            <div class="text-2">
              {{
                status.pdset == 1
                  ? "定期修改密码可以有效保障帐号安全"
                  : "用于保护帐号和帐号安全登录"
              }}
            </div>
          </div>
          <div class="button-box">
            <span
              v-if="status.pdset"
              :title="
                status.mbset ? '' : '绑定手机以后可以验证手机号码重置密码'
              "
              @click="handleCaptchaType('getbackPwd')"
              class="button-box-sub"
              >找回密码</span
            >
            <button
              class="button-primary"
              type="button"
              @click="handleCaptchaType('password')"
            >
              {{ status.pdset == 1 ? "修改密码" : "设置密码" }}
            </button>
          </div>
        </div>

        <div class="cell">
          <div class="icon">
            <span class="iconfont iconemail_" />
          </div>
          <div class="text">
            <div class="text-1">
              安全邮箱
              <span class="special" v-show="status.emset == 0">
                <Icon type="md-alert" />未绑定
              </span>
            </div>
            <div class="text-2">
              {{
                status.emset == 1
                  ? "小白重要的活动或者更新信息我们会通过邮箱通知您"
                  : "安全邮箱将可用于小白帐号的安全验证，建议立即设置"
              }}
            </div>
          </div>
          <div class="button-box">
            <button
              class="button-primary"
              type="button"
              @click="handleCaptchaType('email')"
            >
              {{ status.emset == 1 ? "修改邮箱" : "立即绑定" }}
            </button>
          </div>
        </div>

        <div class="cell">
          <div class="icon">
            <span class="iconfont iconphone_" />
          </div>
          <div class="text">
            <div class="text-1">
              安全手机 {{ status.mbset ? status.mobile : "" }}
              <span class="special" v-show="!status.mbset">
                <Icon type="md-alert" />未绑定
              </span>
            </div>
            <div class="text-2">
              安全手机可以用于登录小白帐号，重置密码或其他安全验证
            </div>
          </div>
          <div class="button-box">
            <button
              class="button-primary"
              type="button"
              @click="handleCaptchaType('mobile')"
            >
              {{ status.mbset ? "修改手机号" : "立即绑定" }}
            </button>
          </div>
        </div>
      </div>

      <div class="personal-info" v-show="getFunction === 'info'">
        <div class="title">
          <button
            class="button-cancel mr-10"
            type="button"
            v-show="status.isEdit"
            @click="status.isEdit = false"
          >
            取消修改
          </button>
          <button class="button-primary" type="button" @click="editInfo">
            {{ status.isEdit ? "保存修改" : "编辑资料" }}
          </button>
        </div>

        <div class="content">
          <Form
            ref="info"
            :rules="rules"
            :model="model.info"
            @keydown.native.enter.prevent="editInfo"
          >
            <FormItem class="cell" prop="nickname">
              <div class="title">
                <span class="iconfont iconnickname_" />&nbsp;&nbsp;昵称：
              </div>
              <div class="text" v-show="status.isEdit">
                <Input
                  class="input"
                  :maxlength="10"
                  placeholder="请输入昵称"
                  v-model="model.info.nickname"
                />
              </div>
              <div
                class="text show"
                :style="{
                  color: isEmpty(status.nickname) ? '#a2a9b3' : '#323232'
                }"
                v-show="!status.isEdit"
              >
                {{
                  status.nickname == "" ? "暂未进行昵称设置" : status.nickname
                }}
              </div>
              <div class="clr" />
            </FormItem>

            <FormItem class="cell" prop="sex">
              <div class="title">
                <span class="iconfont icongender_" />&nbsp;&nbsp;性别：
              </div>
              <div class="text" v-show="status.isEdit">
                <RadioGroup v-model="model.info.sex">
                  <Radio label="1">男</Radio>
                  <Radio label="2">女</Radio>
                  <Radio label="0">不公开</Radio>
                </RadioGroup>
              </div>
              <div
                class="text show"
                :style="{ color: isEmpty(status.sex) ? '#a2a9b3' : '#323232' }"
                v-show="!status.isEdit"
              >
                {{ getSex() }}
              </div>
              <div class="clr" />
            </FormItem>

            <FormItem class="cell" prop="birthday">
              <div class="title">
                <span class="iconfont iconbirthday_" />&nbsp;&nbsp;生日：
              </div>
              <div class="text" v-show="status.isEdit">
                <DatePicker
                  type="date"
                  format="yyyy-MM-dd"
                  placeholder="请选择生日"
                  placement="right-start"
                  @on-change="model.info.birthday = $event"
                  :value="model.info.birthday"
                />
              </div>
              <div
                class="text show"
                :style="{
                  color: isEmpty(status.birthday) ? '#a2a9b3' : '#323232'
                }"
                v-show="!status.isEdit"
              >
                {{
                  status.birthday == "" ? "暂未进行生日设置" : status.birthday
                }}
              </div>
              <div class="clr" />
            </FormItem>

            <FormItem class="cell" prop="realname">
              <div class="title">
                <span class="iconfont iconname_" />&nbsp;&nbsp;姓名：
              </div>
              <div class="text" v-show="status.isEdit">
                <Input
                  class="input"
                  :maxlength="10"
                  placeholder="请输入姓名"
                  v-model="model.info.realname"
                />
              </div>
              <div
                class="text show"
                :style="{
                  color: isEmpty(status.realname) ? '#a2a9b3' : '#323232'
                }"
                v-show="!status.isEdit"
              >
                {{
                  status.realname == "" ? "暂未进行姓名设置" : status.realname
                }}
              </div>
              <div class="clr" />
            </FormItem>

            <FormItem class="cell" prop="sign">
              <div class="title">
                <span class="iconfont iconposition_" />&nbsp;&nbsp;签名：
              </div>
              <div class="text" v-show="status.isEdit">
                <Input
                  class="input"
                  :maxlength="30"
                  placeholder="请输入签名"
                  v-model="model.info.sign"
                />
              </div>
              <div
                class="text show"
                :style="{ color: isEmpty(status.sign) ? '#a2a9b3' : '#323232' }"
                v-show="!status.isEdit"
              >
                {{ status.sign == "" ? "暂未进行签名设置" : status.sign }}
              </div>
              <div class="clr" />
            </FormItem>

            <FormItem class="cell" prop="homepage">
              <div class="title">
                <span class="iconfont iconwebpage_" />&nbsp;&nbsp;主页：
              </div>
              <div class="text" v-show="status.isEdit">
                <Input
                  class="input"
                  v-model="model.info.homepage"
                  placeholder="请输入主页"
                />
              </div>
              <div class="text show" v-show="!status.isEdit">
                <div
                  :style="{
                    color: isEmpty(status.homepage) ? '#a2a9b3' : '#323232'
                  }"
                  :title="status.homepage"
                >
                  {{
                    status.homepage == ""
                      ? "暂未进行主页设置"
                      : status.homepage.length > 30
                      ? status.homepage.substring(0, 30) + "..."
                      : status.homepage
                  }}
                </div>
              </div>
              <div class="clr" />
            </FormItem>

            <FormItem class="cell" prop="area">
              <div class="title">
                <span class="iconfont iconposition_" />&nbsp;&nbsp;地区：
              </div>
              <div class="text" v-show="status.isEdit">
                <Cascader
                  placeholder="请选择地区"
                  :data="data.area"
                  v-model="model.info.area"
                  @on-change="areaChange"
                />
              </div>
              <div
                class="text show"
                :style="{
                  color: isEmpty(status.areainfo) ? '#a2a9b3' : '#323232'
                }"
                v-show="!status.isEdit"
              >
                {{
                  status.areainfo == "" ? "暂未进行地区设置" : status.areainfo
                }}
              </div>
              <div class="clr" />
            </FormItem>

            <FormItem class="cell" prop="address">
              <div class="title">
                <span class="iconfont iconaddress_1" />&nbsp;&nbsp;地址：
              </div>
              <div class="textarea" v-show="status.isEdit">
                <Input
                  type="textarea"
                  v-model="model.info.address"
                  placeholder="请输入地址"
                  :autosize="false"
                />
              </div>
              <div class="text show" v-show="!status.isEdit">
                <a
                  :style="{
                    color: isEmpty(status.address) ? '#a2a9b3' : '#323232'
                  }"
                  :title="status.address"
                >
                  {{
                    status.address == ""
                      ? "暂未进行地区设置"
                      : status.address.length > 30
                      ? status.address.substring(0, 30) + "..."
                      : status.address
                  }}
                </a>
              </div>
              <div class="clr" />
            </FormItem>
          </Form>
        </div>
      </div>

      <div class="authorization" v-show="getFunction === 'authorization'">
        <div class="authorization__container">
          <div class="qq">
            <div
              :class="['bg', status.qqset == '1' ? 'QQBinded' : 'QQUnBind']"
            ></div>
            <div class="info">
              <span class="title">QQ</span>
              <span
                :class="status.qqset == '1' ? 'statusBinded' : 'statusUnbinded'"
                >{{ status.qqset == "1" ? "已关联" : "未关联" }}</span
              >
            </div>
            <a
              class="button-circle"
              v-if="status.qqset == 0"
              target="view_window"
              href="/api/home.json?act=qqbind"
              >关联授权</a
            >
            <button
              type="button"
              class="button-circle"
              v-else
              @click="unbind('qqunbind')"
            >
              取消关联
            </button>
          </div>
          <div class="wechat">
            <div
              :class="[
                'bg',
                status.wechatset == 1 ? 'wechatBinded' : 'wechatUnBind'
              ]"
            />
            <div class="info">
              <span class="title">微信</span>
              <span
                :class="
                  status.wechatset == 1 ? 'statusBinded' : 'statusUnbinded'
                "
                >{{ status.wechatset == 1 ? "已关联" : "未关联" }}</span
              >
            </div>
            <a
              class="button-circle"
              v-if="status.wechatset == 0"
              target="view_window"
              href="/api/home.json?act=wechatbind"
              >关联授权</a
            >
            <button
              type="button"
              class="button-circle"
              v-else
              @click="unbind('wechatunbind')"
            >
              取消关联
            </button>
          </div>
        </div>
        <div class="authorization__notice">
          关联授权帐号可提高小白帐号的安全度，可用于找回密码以及身份验证
          <br />建议关联
        </div>
      </div>

      <Avatar v-show="getFunction === 'avatar'" />

      <SyncSettings v-show="getFunction === 'sync'" />
    </div>

    <Modal
      v-model="status.modalAccount"
      class="modal"
      :styles="{ width: '440px' }"
      :closable="false"
      :mask-closable="false"
      :footer-hide="true"
    >
      <div slot="header" class="ivu-modal-header-inner">
        设置帐号
        <button
          title="关闭"
          class="close"
          @click="handleModalCancel('modalAccount')"
        >
          <i class="icon iconfont iconClose-box-px" />
        </button>
      </div>
      <Form
        class="form"
        ref="accountSet"
        :model="model.safe"
        :rules="rules"
        @keydown.native.enter.prevent="saveAccount"
      >
        <FormItem prop="account">
          <Row>
            <Col>
              <Input
                v-model="model.safe.account"
                placeholder="请输入帐号,由字母数字组合(6到16位)"
                :maxlength="16"
              />
            </Col>
          </Row>
        </FormItem>
        <p>帐号可以用来登录，并且将使用在论坛中（请避免私密数据）</p>
        <p>
          设置以后
          <span style="color:#FF0000;">不能修改</span>
        </p>

        <Row class="footer mt-35">
          <Col>
            <button class="button-primary" type="button" @click="saveAccount">
              确认
            </button>
          </Col>
        </Row>
      </Form>
    </Modal>

    <Modal
      v-model="status.modalCaptcha"
      class="modal captcha"
      :styles="{ width: '440px' }"
      :closable="false"
      :mask-closable="false"
      :footer-hide="true"
    >
      <div slot="header" class="ivu-modal-header-inner">
        {{ status.modalTitle }}
        <button
          title="关闭"
          class="close"
          @click="handleModalCancel('modalCaptcha')"
        >
          <i class="icon iconfont iconClose-box-px" />
        </button>
      </div>
      <div class="text" style="margin-bottom: 20px;">
        请输入手机号{{ status.mobile }}收到的短信验证码
      </div>
      <Form
        class="form"
        ref="moblieCaptcha"
        :model="model.safe"
        :rules="rules"
        @keydown.native.enter.prevent="judgeMoblieCaptcha"
      >
        <Row>
          <Col span="16" style="width: 250px; marginRight: 9px;">
            <FormItem prop="captcha">
              <Row>
                <Col>
                  <Input
                    v-model="model.safe.captcha"
                    :maxlength="6"
                    placeholder="请输入验证码"
                  />
                </Col>
              </Row>
            </FormItem>
          </Col>
          <Col span="8" style="width: 100px">
            <Button
              type="primary"
              class="button-primary-ghost"
              ghost
              :style="{ color: status.disabled ? 'red' : '' }"
              :disabled="status.disabled"
              :loading="status.loadingGetCaptcha"
              @click="getMoblieCaptcha"
              >{{ status.buttonText }}</Button
            >
          </Col>
        </Row>
        <FormItem v-if="model.safe.type === 6" prop="password">
          <Row>
            <Col>
              <Input
                v-model="model.safe.password"
                type="password"
                placeholder="请输入新密码"
              />
            </Col>
          </Row>
        </FormItem>

        <FormItem v-if="model.safe.type === 6" prop="rpassword">
          <Row>
            <Col>
              <Input
                v-model="model.safe.rpassword"
                type="password"
                placeholder="请再次输入新密码"
              />
            </Col>
          </Row>
        </FormItem>
      </Form>

      <Row class="footer mt-35">
        <Col>
          <button
            class="button-primary"
            type="button"
            @click="judgeMoblieCaptcha"
          >
            {{ model.safe.type === 6 ? "找回密码" : "下一步" }}
          </button>
        </Col>
      </Row>
    </Modal>

    <Modal
      v-model="status.modalEmail"
      class="modal email"
      :styles="{ width: '440px' }"
      :closable="false"
      :mask-closable="false"
      :footer-hide="true"
    >
      <div slot="header" class="ivu-modal-header-inner">
        邮箱绑定
        <button
          title="关闭"
          class="close"
          @click="handleModalCancel('modalEmail')"
        >
          <i class="icon iconfont iconClose-box-px" />
        </button>
      </div>
      <Form
        class="form"
        ref="emailCaptcha"
        :model="model.safe"
        :rules="rules"
        @keydown.native.enter.prevent="saveEmail"
      >
        <FormItem prop="email">
          <Row>
            <Col>
              <Input v-model="model.safe.email" placeholder="请输入邮箱帐号" />
            </Col>
          </Row>
        </FormItem>

        <FormItem prop="captcha">
          <Row>
            <Col span="16" style="width: 250px; marginRight: 9px;">
              <Input
                v-model="model.safe.captcha"
                :maxlength="6"
                placeholder="请输入验证码"
              />
            </Col>
            <Col span="8" style="width: 100px">
              <Button
                type="primary"
                class="button-primary-ghost"
                ghost
                :style="{ color: status.disabled ? 'red' : '' }"
                :disabled="status.disabled"
                :loading="status.loadingGetCaptcha"
                @click="getEmailCaptcha"
                >{{ status.buttonText }}</Button
              >
            </Col>
          </Row>
        </FormItem>
        <Row class="footer mt-35">
          <Col>
            <button
              class="button-cancel"
              type="button"
              style="marginRight:5px"
              @click="status.modalEmail = false"
            >
              取消
            </button>
            <button class="button-primary" type="button" @click="saveEmail">
              确认
            </button>
          </Col>
        </Row>
      </Form>
    </Modal>

    <Modal
      v-model="status.modalPassword"
      class="modal password"
      :styles="{ width: '440px' }"
      :closable="false"
      :mask-closable="false"
      :footer-hide="true"
    >
      <div slot="header" class="ivu-modal-header-inner">
        {{ status.pdset == 1 ? "修改密码" : "设置密码" }}
        <button
          title="关闭"
          class="close"
          @click="handleModalCancel('modalPassword')"
        >
          <i class="icon iconfont iconClose-box-px" />
        </button>
      </div>
      <Form
        class="form"
        ref="password"
        :model="model.safe"
        :rules="rules"
        @keydown.native.enter.prevent="savePassword"
      >
        <FormItem v-if="status.pdset" prop="oldpassword">
          <Row>
            <Col>
              <Input
                v-model="model.safe.oldpassword"
                type="password"
                placeholder="请输入原密码"
              />
            </Col>
          </Row>
        </FormItem>
        <FormItem prop="password">
          <Row>
            <Col>
              <Input
                v-model="model.safe.password"
                type="password"
                :placeholder="status.pdset == 1 ? '请输入新密码' : '请输入密码'"
              />
            </Col>
          </Row>
        </FormItem>

        <FormItem prop="rpassword">
          <Row>
            <Col>
              <Input
                v-model="model.safe.rpassword"
                type="password"
                :placeholder="
                  status.pdset == 1 ? '请再次输入新密码' : '请再次输入密码'
                "
              />
            </Col>
          </Row>
        </FormItem>
        <Row class="footer mt-40">
          <Col>
            <button
              class="button-cancel"
              type="button"
              style="marginRight:5px"
              @click="handleModalCancel('modalPassword')"
            >
              取消
            </button>
            <button class="button-primary" type="button" @click="savePassword">
              确认
            </button>
          </Col>
        </Row>
      </Form>
    </Modal>

    <Modal
      v-model="status.modalMobile"
      class="modal mobile"
      :styles="{ width: '440px' }"
      :closable="false"
      :mask-closable="false"
      :footer-hide="true"
    >
      <AreaCode
        v-if="status.areaCodeFlag"
        @user_area_code="getAreaCode"
        @user_area_code_hide="hideAreaCode"
      />

      <div
        slot="header"
        class="ivu-modal-header-inner"
        v-if="!status.areaCodeFlag"
      >
        {{ status.mbset ? "修改手机号" : "绑定手机号" }}
        <button
          title="关闭"
          class="close"
          @click="handleModalCancel('modalMobile')"
        >
          <i class="icon iconfont iconClose-box-px" />
        </button>
      </div>
      <Form
        class="form"
        ref="mobile"
        v-if="!status.areaCodeFlag"
        :model="model.safe"
        :rules="rules"
        @keydown.native.enter.prevent="saveMobile"
      >
        <FormItem prop="mobile">
          <Row>
            <Col>
              <div class="area-code" @click="showAreaCode">
                +{{ model.safe.areacode }}&nbsp;
                <span class="icon iconfont iconArrowtop-px" />
              </div>
              <Input
                class="input-mobile"
                v-model="model.safe.mobile"
                placeholder="请输入手机号"
              />
            </Col>
          </Row>
        </FormItem>

        <FormItem prop="captcha">
          <Row>
            <Col span="16" style="width: 250px; marginRight: 9px;">
              <Input
                v-model="model.safe.captcha"
                :maxlength="6"
                placeholder="请输入验证码"
              />
            </Col>
            <Col span="8" style="width: 100px">
              <Button
                type="primary"
                class="button-primary-ghost"
                ghost
                :style="{ color: status.disabled ? 'red' : '' }"
                :disabled="status.disabled"
                :loading="status.loadingGetCaptcha"
                @click="getNewMoblieCaptcha"
                >{{ status.buttonText }}</Button
              >
            </Col>
          </Row>
        </FormItem>

        <Row class="footer mt-35">
          <Col>
            <button
              class="button-cancel"
              type="button"
              style="marginRight:5px"
              @click="status.modalMobile = false"
            >
              取消
            </button>
            <button class="button-primary" type="button" @click="saveMobile">
              确认
            </button>
          </Col>
        </Row>
      </Form>
    </Modal>

    <Modal
      v-model="status.sureUnbind"
      class="modal mobile"
      :styles="{ width: '416px' }"
      :closable="false"
      :mask-closable="false"
      :footer-hide="true"
    >
      <div slot="header" class="ivu-modal-header-inner">
        <button title="关闭" class="close" @click="confirmUnbind('cancel')">
          <i class="icon iconfont iconClose-box-px" />
        </button>
      </div>
      <p style="fontSize: 14px;">
        解绑第三方帐号后，您将不能使用第三方授权快捷登录
      </p>
      <p style="fontSize: 14px;">确定要解绑吗？</p>
      <Form class="form">
        <Row class="footer mt-35">
          <Col>
            <button
              class="button-primary"
              type="button"
              style="marginRight:5px"
              @click="confirmUnbind('ok')"
            >
              确认
            </button>
            <button
              class="button-cancel"
              type="button"
              @click="confirmUnbind('cancel')"
            >
              取消
            </button>
          </Col>
        </Row>
      </Form>
    </Modal>

    <Modal
      v-model="status.beforeUnbind"
      class="modal mobile"
      :styles="{ width: '416px' }"
      :closable="false"
      :mask-closable="false"
      :footer-hide="true"
    >
      <div slot="header" class="ivu-modal-header-inner">
        <button title="关闭" class="close" @click="status.beforeUnbind = false">
          <i class="icon iconfont iconClose-box-px" />
        </button>
      </div>
      <p style="fontSize: 14px;">
        您需要设置帐号密码或者绑定手机号码后才能解绑
      </p>
      <p style="fontSize: 14px;">第三方帐户，否则此帐号会丢失</p>
      <Form class="form">
        <Row class="footer mt-35">
          <Col>
            <button
              class="button-primary"
              type="button"
              style="marginRight:5px"
              @click="beforeUnbindSet('account')"
            >
              去设置帐号密码
            </button>
            <button
              class="button-primary"
              type="button"
              @click="beforeUnbindSet('mobile')"
            >
              去绑定手机
            </button>
          </Col>
        </Row>
      </Form>
    </Modal>
  </div>
</template>

<script>
import areaData from "./area.js";
import SyncSettings from "./components/sync-settings";
import Avatar from "./components/avatar";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
export default {
  name: "edit",
  components: {
    SyncSettings,
    Avatar
  },
  data() {
    return {
      status: {
        // 左侧边栏
        function: "safe", // 左边4个菜单的选择状态
        // 头像修改
        avatar: null, // 头像
        cropper: false, // 裁剪组件显示
        // 头像修改
        avatarId: "", // 精选头像ID
        // 帐号安全
        score: 0, // 安全等级
        mobile: "", // 安全手机
        account: "", //帐号
        accountset: 0, // 是否设置过帐号，0 未设置，1 已设置
        pdset: 0, // 是否设置过密码，0 未设置，1 已设置
        emset: 0, // 是否绑定过邮箱，0 未设置，1 已设置
        // 个人信息
        isEdit: false, // 是否为编辑状态
        qqset: 0, // 是否绑定QQ，0 未绑定，1 已绑定
        wechatset: 0, // 是否绑定微信，0 未绑定，1 已绑定
        nickname: "", // 昵称
        sex: "", // 性别
        birthday: "", // 生日
        realname: "", // 姓名
        sign: "", // 签名
        homepage: "", // 主页
        area: [], // 组件用的数据
        address: "", // 性别
        province: 0, // 省
        city: 0, // 市
        district: 0, // 区
        areainfo: "", // 地址
        // 弹窗
        modalAccount: false, // 帐号设置，弹窗状态
        modalCaptcha: false, // 短信验证，弹窗状态
        modalPassword: false, // 修改密码，弹窗状态
        modalEmail: false, // 换绑邮箱，弹窗状态
        modalMobile: false, // 换绑手机，弹窗状态
        modalTitle: "修改密码", // title文字
        sureUnbind: false, // 确认弹窗，弹窗状态
        beforeUnbind: false, // 解绑前验证是否有绑定
        isUnbindqq: true, // 是否解绑QQ
        promise: null,
        // 获取验证码
        disabled: false, // 获取验证码按钮，disabled状态
        buttonText: "获取验证码", // 验证码按钮文本
        num: 179, // 验证码倒数计数
        interval: null, // 验证码interval循环变量
        loadingGetCaptcha: false, // 验证码按钮loading状态
        areaCodeFlag: false // 手机区号选择框显示状态
      },
      data: {
        area: areaData, // 省市区下拉菜单data
        file: null, // 上传头像保存的file
        previewAvatar: null // 头像
      },
      model: {
        safe: {
          captcha: "", // 验证码
          type: 1, // 类型：2=修改密码 3=初次绑定手机号 4=换绑手机的旧手机 5=换绑手机的新手机 6=找回密码
          oldpassword: "", // 原密码
          password: "", // 新密码
          rpassword: "", // 再次输入新密码
          email: "", // 邮箱帐号
          mobile: "", // 手机号
          areacode: "86", // 手机区号
          account: "" // 帐号
        },
        info: {
          nickname: "", // 昵称
          sex: "", // 性别
          birthday: "", // 生日
          realname: "", // 姓名
          sign: "", // 签名
          homepage: "", // 主页
          area: [], // 组件用的数据
          address: "", // 性别
          province: 0, // 省
          city: 0, // 市
          district: 0, // 区
          areainfo: "" // 地址
        },
        uc_hmac: "", // hamc
        unbindAct: "qqunbind" // 解绑接口参数act
      },
      rules: {
        nickname: {
          required: true,
          message: "请输入正确的昵称",
          trigger: "change"
        },
        sex: { required: false, message: "请选择性别", trigger: "change" },
        birthday: { required: false, message: "请选择生日", trigger: "change" },
        realname: {
          required: false,
          message: "请输入正确的姓名",
          trigger: "change"
        },
        sign: {
          required: false,
          message: "请输入正确的签名",
          trigger: "change"
        },
        homepage: {
          required: false,
          message: "请输入正确的主页",
          trigger: "change"
        },
        area: {
          required: false,
          type: "array",
          message: "请选择地区",
          trigger: "change"
        },
        address: {
          required: false,
          message: "请输入正确的地址",
          trigger: "change"
        },
        oldpassword: [
          {
            required: true,
            message: "请输入6-20位数字、字母组成的密码",
            trigger: "change"
          },
          { validator: this.checkOldpassword, trigger: "input" }
        ],
        password: [
          {
            required: true,
            message: "请输入6-20位数字、字母组成的密码",
            trigger: "change"
          },
          { validator: this.checkPassword, trigger: "input" }
        ],
        rpassword: [
          { required: true, message: "请再次输入密码", trigger: "change" },
          { validator: this.checkPassWork, trigger: "input" }
        ],
        email: {
          required: true,
          message: "邮箱帐号输入不正确",
          trigger: "change"
        },
        mobile: {
          required: true,
          message: "手机号输入不正确",
          trigger: "change"
        },
        captcha: {
          required: true,
          message: "请输入6位数字验证码",
          trigger: "change",
          len: 6
        },
        account: [
          {
            required: true,
            message: "请输入6-16位数字、字母组成的帐号",
            trigger: "change"
          },
          { validator: this.checkAccount, trigger: "input" }
        ]
      }
    };
  },
  // props: ['userData'],
  computed: {
    ...mapState("main", {
      isLogin: "isLogin",
      userData: "user_info_data"
    }),
    ...mapGetters(["getFunction", "getUserInfo"])
  },

  watch: {
    userData(val, val_) {
      this.initInfoData();
    },
    $route(val, val_) {
      this.queryShowWhich(val.query.t);
    }
  },

  created() {
    this.initInfoData();
    // this.getApiUserInfo() //获取基本信息
    this.show_edit();
    // 如果hash值是有“#bind?message=”，通过弹窗提示信息
    if (window.location.hash.indexOf("#bind?message=") != -1) {
      this.message_default(decodeURI(window.location.hash.split("=")[1]));
      // location.hash = '';
      this.setFunction("authorization");
      this.$router.push("/edit");
    }
    if (this.status.nickname === "未设置") {
      this.setFunction("info");
    }
    this.queryShowWhich(this.$route.query.t);
  },

  methods: {
    ...mapMutations("main", {
      show_edit: "show_edit" // '/edit'刷新时，控制edit时的header样式
      // user_area_code: 'user_area_code',
      // user_area_code_hide: 'user_area_code_hide',
    }),
    ...mapMutations(["setFunction"]),

    ...mapActions("main", {
      initData: "handleGetUserInfo"
    }),

    queryShowWhich(t) {
      switch (t) {
        case "nk":
          this.setFunction("info");
          break;
        case "sync":
          this.setFunction("sync");
          break;
      }
    },

    isEmpty(data) {
      if (data === "" || data === undefined || data.length === 0) return true;
      else return false;
    },

    confirmUnbind(status) {
      const { unbindAct } = this.model;
      switch (status) {
        case "ok":
          // console.log(unbindAct);
          this.$api
            .postHome({
              act: unbindAct
            })
            .then(res => {
              this.status.sureUnbind = false;
              this.initData();
            });
          break;
        case "cancel":
          this.status.sureUnbind = false;
          break;
      }
    },

    beforeUnbindSet(type) {
      this.setFunction("safe");

      if (this.status.accountset && type === "account") {
        type = "password";
      }
      this.handleCaptchaType(type);
    },

    unbind(_act) {
      if (
        !this.status.mbset &&
        (!this.status.accountset || !this.status.pdset)
      ) {
        this.status.beforeUnbind = true;
      } else {
        this.status.sureUnbind = true;
        this.model.unbindAct = _act;
      }
    },

    getAreaCode(code) {
      this.model.safe.areacode = code;
    },

    hideAreaCode() {
      this.status.areaCodeFlag = false;
    },

    showAreaCode() {
      this.status.areaCodeFlag = true;
    },

    initInfoData() {
      let data = this.userData;
      this.model.info = {
        ...data,
        sex: data.sex + "",
        area: [data.province, data.city, data.district]
      };
      this.status = {
        ...this.status,
        ...data,
        sex: data.sex + ""
      };

      // console.log(this.status);
    },

    handleModalCancel(_name) {
      this.status[_name] = false;
      this.status.loadingGetCaptcha = false;
      setTimeout(() => {
        this.resetCaptchaButton();
      }, 500);
      this.resetForm();
    },

    areaChange(value, selectedData) {
      this.model.info = {
        ...this.model.info,
        province: value[0],
        city: value[1],
        district: value[2]
      };
    },

    async getNewMoblieCaptcha() {
      this.model.safe.type = this.status.mbset ? 5 : 3;
      const { mobile, areacode, type } = this.model.safe;
      if (!this.isPhoneNum(mobile)) {
        return;
      }
      const getHamc = await this.$api.getHmac();
      this.status.loadingGetCaptcha = true;

      //2.发送验证码
      this.$api
        .postHome({
          act: "sendsmscaptcha",
          type,
          areacode: areacode,
          mobile: mobile,
          s: this.$md5(mobile + getHamc.data.uc_hmac)
        })
        .then(res => {
          this.status.loadingGetCaptcha = false;
          this.handleGetCaptchaButton();
          // console.log('获取验证码成功__', res)
        })
        .catch(error => {
          this.status.loadingGetCaptcha = false;
          // console.log('获取验证码失败__', error)
        });
    },

    handleGetCaptchaButton() {
      let { num, disabled } = this.status;

      this.status.disabled = true;
      this.status.buttonText = `179秒后重试`;
      this.status.interval = setInterval(() => {
        if (num != 1) {
          num--;
          this.status.buttonText = `${num}秒后重试`;
        } else {
          clearInterval(this.status.interval);
          this.status = {
            ...this.status,
            disabled: false,
            buttonText: "获取验证码",
            num: 179
          };
        }
      }, 1000);
    },

    handleCaptchaType(status) {
      const { mobile, pdset, mbset } = this.status;

      switch (status) {
        case "account":
          this.status.modalAccount = true;
          break;
        case "password":
          if (!this.status.accountset && !this.status.pdset) {
            this.$Message.info({
              content:
                '<span class="icon iconfont iconPrompt-px2"></span>请在设置帐号后再设置密码',
              duration: 2.5
            });
            return;
          }
          this.status.modalTitle = pdset == 1 ? "修改密码" : "设置密码";
          // this.status.modalCaptcha = true
          // this.model.safe.type = 2

          this.status.modalPassword = true;
          break;
        case "getbackPwd":
          if (!this.status.mbset) {
            this.$Message.info({
              content:
                '<span class="icon iconfont iconPrompt-px2"></span>绑定手机以后可以验证手机号码重置密码',
              duration: 2.5
            });
            return;
          }
          this.status.modalTitle = "找回密码";
          this.model.safe.type = 6;
          this.status.modalCaptcha = true;
          break;
        case "email":
          this.status.modalEmail = true;
          break;
        case "mobile":
          if (mbset) {
            this.status.modalTitle = "修改手机号";
            this.status.modalCaptcha = true;
            this.model.safe.type = 4;
          } else {
            this.status.modalMobile = true;
          }

          break;
      }
    },

    async getMoblieCaptcha() {
      const { type } = this.model.safe;
      const getHamc = await this.$api.getHmac();
      let data = {
        act: "getsmscaptcha",
        type: type,
        s: this.$md5(type + getHamc.data.uc_hmac)
      };
      this.status.loadingGetCaptcha = true;
      this.$api
        .postHome(data)
        .then(res => {
          if (type === 6) return;
          this.status.loadingGetCaptcha = false;
          this.handleGetCaptchaButton();
          // console.log('获取密码验证码成功__', res)
        })
        .catch(error => {
          this.status.loadingGetCaptcha = false;
          // console.log('获取密码验证码失败__', error)
        });
    },

    async getEmailCaptcha() {
      const { email } = this.model.safe;
      const getHamc = await this.$api.getHmac();
      this.status.loadingGetCaptcha = true;

      this.$api
        .postHome({
          act: "modifyem1",
          email: email,
          s: this.$md5(email + getHamc.data.uc_hmac)
        })
        .then(res => {
          this.status.loadingGetCaptcha = false;
          this.handleGetCaptchaButton();
          // console.log('获取邮箱验证码成功__', res)
        })
        .catch(error => {
          this.status.loadingGetCaptcha = false;
          // console.log('获取邮箱验证码失败__', error)
        });
    },

    judgeMoblieCaptcha() {
      const { captcha, type, password, oldpassword } = this.model.safe;
      let _act = "";
      if (type == 2) _act = "modifypwd1";
      if (type == 4) _act = "modifymb1";

      this.$refs["moblieCaptcha"].validate(valid => {
        if (valid) {
          let data = {};
          if (type === 6) {
            data = {
              act: "getpwd",
              captcha: captcha,
              password: this.$md5(password)
            };
          } else {
            data = {
              act: _act,
              captcha: captcha
            };
          }
          this.$api.postHome(data).then(res => {
            this.goBack();
            if (type == 2) this.status.modalPassword = true;
            if (type == 4) this.status.modalMobile = true;
            // console.log('验证验证码成功__', res)
          });
          // .catch(error => {
          //   console.log('验证验证码失败__', error)
          // });
        }
      });
    },

    saveAccount() {
      const { account } = this.model.safe;
      this.$refs["accountSet"].validate(valid => {
        if (valid) {
          this.$api
            .postHome({
              act: "setaccount",
              account
            })
            .then(res => {
              this.initData();

              this.goBack();
              // console.log("帐号设置成功__", res);
            });
        }
      });
    },

    saveEmail() {
      const { email, captcha } = this.model.safe;

      this.$refs["emailCaptcha"].validate(valid => {
        if (valid) {
          this.$api
            .postHome({
              act: "modifyem2",
              email: email,
              captcha: captcha
            })
            .then(res => {
              this.goBack();
              // console.log('邮箱帐号设置成功__', res)
            });
          // .catch(error => {
          //   console.log('邮箱帐号设置失败__', error)
          // });
        }
      });
    },

    savePassword() {
      const { password, oldpassword } = this.model.safe;
      const { pdset } = this.status;
      this.$refs["password"].validate(valid => {
        if (valid) {
          let data = {};
          if (pdset) {
            data = {
              act: "modifypwd",
              old_password: this.$md5(oldpassword),
              new_password: this.$md5(password)
            };
          } else {
            data = {
              act: "setpwd",
              password: this.$md5(password)
            };
          }
          this.$api.postHome(data).then(res => {
            this.goBack();
          });
        }
      });
    },

    saveMobile() {
      const { mobile, captcha, areacode, type } = this.model.safe;

      this.$refs["mobile"].validate(valid => {
        if (valid) {
          let data = {};
          if (type === 6) {
            data = {
              act: "getpwd",
              areacode: areacode,
              mobile: mobile,
              captcha: captcha
            };
          } else if (type === 3) {
            data = {
              act: "setmb",
              areacode: areacode,
              mobile: mobile,
              captcha: captcha
            };
          } else {
            data = {
              act: "modifymb2",
              areacode: areacode,
              mobile: mobile,
              captcha: captcha
            };
          }
          this.$api.postHome(data).then(res => {
            this.goBack();
            // console.log('换绑手机成功__', res)
          });
          // .catch(error => {
          //   console.log('换绑手机失败__', error)
          // });
        }
      });
    },

    checkOldpassword(rule, value, callback) {
      if (/^(\d|[a-z]|[A-Z]){6,20}$/.test(value)) {
        callback();
      } else {
        return callback(new Error("输入6-20位数字、字母组成的密码"));
      }
    },

    checkPassword(rule, value, callback) {
      if (/^(\d|[a-z]|[A-Z]){6,20}$/.test(value)) {
        callback();
      } else {
        return callback(new Error("输入6-20位数字、字母组成的密码"));
      }
    },

    checkPassWork(rule, value, callback, source, options) {
      const { password } = this.model.safe;
      if (value != password) {
        return callback(new Error("两次密码不一致"));
      } else {
        callback();
      }
    },

    checkAccount(rule, value, callback, source, options) {
      if (/^(\d|[a-z]|[A-Z]){6,16}$/.test(value)) {
        callback();
      } else {
        callback(new Error("输入6-16位数字、字母组成的帐号"));
      }
    },

    getSex() {
      switch (this.status.sex) {
        case "1":
          return "男";
        case "2":
          return "女";
        case "0":
          return "不公开";
        default:
          return "暂未进行性别设置";
      }
    },

    editInfo() {
      const { isEdit } = this.status;
      const {
        nickname,
        sex,
        birthday,
        realname,
        sign,
        homepage,
        address,
        province,
        city,
        district
      } = this.model.info;

      if (isEdit) {
        this.$refs["info"].validate(valid => {
          if (valid) {
            this.$api
              .postHome({
                act: "modifyinfo",
                nickname,
                sex,
                birthday,
                realname,
                sign,
                homepage,
                address,
                province,
                city,
                district
              })
              .then(res => {
                this.status.isEdit = false;
                this.resetForm();
                this.initData();
                // if (chrome.xb) chrome.xb.setUserStatus(2, '{"nk":"____昵称____","av":"___//xxx.png___"}');
                // console.log('编辑资料成功__', res)
              });
            // .catch(error => {
            //   console.log('编辑资料失败__', error)
            // });
          }
        });
      } else {
        this.status.isEdit = !isEdit;
      }
    },

    getSafeColor() {
      const { score } = this.status;

      if (score == 100) return "#31df9b";
      else if (score < 100 && 70 <= score) return "#ffb027";
      else if (score < 70) return "#ff7453";
    },
    getSafeNotice() {
      const { score } = this.status;
      let count = 0,
        title = "",
        safe = [
          {
            accountset: "帐号 - 未设置"
          },
          {
            pdset: "帐号密码 - 未设置"
          },
          {
            emset: "安全邮箱 - 未绑定"
          },
          {
            mbset: "安全手机 - 未绑定"
          },
          {
            qqset: "QQ - 未关联"
          },
          {
            wechatset: "微信 - 未关联"
          }
        ];
      if (score == 100)
        return {
          dec: "帐号状态安全",
          title: ""
        };
      // else if (score < 100 && 70 <= score) return '存在1项风险'
      // else if (score < 70) return '存在2项风险'
      for (let i = 0, len = safe.length; len > i; i++) {
        let entries = Object.entries(safe[i])[0];
        if (!this.status[entries[0]]) {
          title += entries[1] + "\n";
          count++;
        }
      }
      return {
        dec: "存在" + count + "项风险",
        title
      };
    },

    reset() {
      this.resetCaptchaButton();
      this.status = {
        // 左侧边栏
        function: "safe", // 左边4个菜单的选择状态
        // 头像修改
        avatar: null, // 头像
        // 头像修改
        avatarId: "", // 精选头像ID
        // 帐号安全
        score: 0, // 安全等级
        mobile: "", // 安全手机
        account: "", //帐号
        accountset: 0, // 是否设置过帐号，0 未设置，1 已设置
        pdset: 0, // 是否设置过密码，0 未设置，1 已设置
        emset: 0, // 是否绑定过邮箱，0 未设置，1 已设置
        // 个人信息
        isEdit: false, // 是否为编辑状态
        qqset: 0, // 是否绑定QQ，0 未绑定，1 已绑定
        wechatset: 0, // 是否绑定微信，0 未绑定，1 已绑定
        nickname: "", // 昵称
        sex: "", // 性别
        birthday: "", // 生日
        realname: "", // 姓名
        sign: "", // 签名
        homepage: "", // 主页
        area: [], // 组件用的数据
        address: "", // 性别
        province: 0, // 省
        city: 0, // 市
        district: 0, // 区
        areainfo: "", // 地址
        // 弹窗
        modalAccount: false, // 帐号设置，弹窗状态
        modalCaptcha: false, // 短信验证，弹窗状态
        modalPassword: false, // 修改密码，弹窗状态
        modalEmail: false, // 换绑邮箱，弹窗状态
        modalMobile: false, // 换绑手机，弹窗状态
        modalTitle: "修改密码", // title文字
        sureUnbind: false, // 确认弹窗，弹窗状态
        beforeUnbind: false, // 解绑前验证是否有绑定
        isUnbindqq: true, // 是否解绑QQ
        promise: null,
        // 获取验证码
        disabled: false, // 获取验证码按钮，disabled状态
        buttonText: "获取验证码", // 验证码按钮文本
        num: 179, // 验证码倒数计数
        interval: null, // 验证码interval循环变量
        loadingGetCaptcha: false, // 验证码按钮loading状态
        areaCodeFlag: false // 手机区号选择框显示状态
      };

      this.model = {
        safe: {
          captcha: "", // 验证码
          type: 1, // 类型：2=修改密码 3=初次绑定手机号 4=换绑手机的旧手机 5=换绑手机的新手机 6=找回密码
          oldpassword: "", // 原密码
          password: "", // 新密码
          rpassword: "", // 再次输入新密码
          email: "", // 邮箱帐号
          mobile: "", // 手机号
          areacode: "86", // 手机区号
          account: "" // 帐号
        },
        info: {
          nickname: "", // 昵称
          sex: "", // 性别
          birthday: "", // 生日
          realname: "", // 姓名
          sign: "", // 签名
          homepage: "", // 主页
          area: [], // 组件用的数据
          address: "", // 性别
          province: 0, // 省
          city: 0, // 市
          district: 0, // 区
          areainfo: "" // 地址
        },
        uc_hmac: "" // hamc
      };

      this.resetForm();
    },

    resetForm() {
      this.$refs["moblieCaptcha"].resetFields();
      this.$refs["emailCaptcha"].resetFields();
      this.$refs["password"].resetFields();
      this.$refs["mobile"].resetFields();
      this.$refs["info"].resetFields();
    },

    resetCaptchaButton() {
      clearInterval(this.status.interval);

      this.status = {
        ...this.status,
        disabled: false,
        buttonText: "获取验证码",
        num: 179
      };
    },

    goBack() {
      this.reset();
      this.initData();
    }
  }
};
</script>

<style lang="less" scoped>
@import "./info-edit.less";
</style>

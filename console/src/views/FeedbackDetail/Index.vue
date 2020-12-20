<template>
  <el-row type="flex" v-loading="loading">
    <el-col :span="24">
      <el-divider>反馈信息</el-divider>
      <h2>用户反馈 #{{ this.$route.params.id }}</h2>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="系统信息">
          <el-input :rows="3" type="textarea" v-model="form.system_info"></el-input>
        </el-form-item>
        <el-form-item label="反馈详情">
          <el-input :rows="5" type="textarea" v-model="form.content"></el-input>
        </el-form-item>
      </el-form>
      <el-divider>后续回复</el-divider>
      <el-row class="chat-row" v-for="(item, index) in form.replies" :key="index">
        <div :class="[item.sender ? '' : 'chat-right', 'chat-box']">
          {{ item.content }} {{ item.sender }}
        </div>
      </el-row>

      <el-form ref="replyForm" :model="replyForm" label-width="100px" style="margin-top: 30px">
        <el-form-item label="回复内容">
          <el-input :rows="4" type="textarea" v-model="replyForm.content"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="addReply">回复</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import FeedbackProxy from '@/proxies/FeedbackProxy';

export default {
  name: 'FeedbackDetail',

  data() {
    return {
      loading: false,
      drawerVisible: false,
      dialogFormVisible: false,
      selectLoading: false,
      form: {
        system_info: '',
        content: '',
        replies: []
      },
      replyForm: {
        content: ''
      },
      search: '',
    };
  },
  mounted() {
    this.fetchDetail();
  },
  methods: {
    fetchDetail() {
      this.loading = true;
      new FeedbackProxy().find(this.$route.params.id)
        .then(res => {
          Object.assign(this.form, res);
        })
        .catch(err => {
          this.$message.error('获取问题数据失败');
        })
        .finally(() => {
          this.loading = false;
        });
    },
    addReply() {
      this.loading = true;
      console.log(this.replyForm);
      new FeedbackProxy().reply(this.$route.params.id, this.replyForm)
        .then(res => {
          this.$notify({
            title: '成功',
            message: '回复成功',
            type: 'success'
          });
          this.replyForm.content = '';
          this.fetchDetail();
        })
        .catch(err => {
          this.$message.error('回复失败');
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style>
.chat-row {
  margin: 10px;
}

.chat-box {
  display: inline;
  float: left;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
}

.chat-right {
  float: right;
  color: #fff;
  background-color: #409EFF;
}
</style>

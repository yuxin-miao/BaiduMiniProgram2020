<template>
  <el-row type="flex">
    <el-col :span="24">
      <el-button @click="drawerVisible = true" type="primary" style="margin-left: 16px;">
        看提示
      </el-button>
      <el-divider>问题信息</el-divider>
      <h2>问题ID: {{ this.$route.params.id }}</h2>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="问题标题">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="关键词">
          <el-input v-model="form.keyword" placeholder="以逗号分隔"></el-input>
        </el-form-item>
        <el-form-item label="回复类型">
          <el-select v-model="form.reply_type" placeholder="请选择回复类型">
            <el-option v-for="(value, name) in REPLY_TYPE_STR" :label="value" :value="name * 1" :key="name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理类型">
          <el-select v-model="form.process_type" placeholder="请选择处理类型">
            <el-option v-for="(value, name) in PROC_TYPE_STR" :label="value" :value="name * 1" :key="name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" style="width: 100%" @click="updateQuestion">更新</el-button>
        </el-form-item>
      </el-form>
      <el-divider>问题选项</el-divider>
      <el-row :gutter="12">
        <el-col :span="6" v-for="item in form.choices" :key="item.id">
          <el-card shadow="hover">
            <div slot="header">
              <span>{{ item.title }}</span>
            </div>
            <div>
              {{ item.reply_content }}
              <el-row :gutter="10" style="margin-top: 10px">
                <el-col :span="12">
                  <el-button
                    v-if="item.dest_question"
                    type="primary"
                    style="width: 100%"
                    size="mini"
                    @click="jumpQuestion(item.dest_question)"
                  >跳转
                  </el-button>
                </el-col>
                <el-col :span="12">
                  <el-popconfirm
                    title="确定删除吗？"
                    icon-color="red"
                    @confirm="deleteChoice(item.id)"
                  >
                    <el-button slot="reference" type="danger" style="width: 100%" size="mini">删除</el-button>
                  </el-popconfirm>
                </el-col>
              </el-row>

            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-col>
    <el-drawer
      title="提示"
      :visible.sync="drawerVisible"
    >
      <el-row style="padding: 0 20px">
        <h3>提示</h3>
        <ul>
          <li>问题标题: 小U回复时的内容</li>
          <li>关键词: 多个关键词用逗号分隔（中英文皆可），用于重新开始话题时匹配问题</li>
          <li>回复类型
            <ul>
              <li>文本: 聊天界面回复框为文本框</li>
              <li>选项: 聊天界面回复框为几个选项</li>
            </ul>
          </li>
          <li>处理类型（心情日记仅对选项回复生效，其余仅对文本回复生效）
            <ul>
              <li>普通: 无论回复什么，跳转第1个选项指向的问题</li>
              <li>感恩日志: 用本轮回答生成一条感恩日志，并跳转第1个选项指向的问题</li>
              <li>心情记录: 用本轮回答生成一条心情日记，并跳转选项</li>
              <li>输入昵称: 将本轮回答作为用户昵称，并跳转第1个选项指向的问题</li>
            </ul>
          </li>
        </ul>
      </el-row>
    </el-drawer>
  </el-row>
</template>

<script>
import QuestionProxy from '@/proxies/QuestionProxy';
import { REPLY_TYPE, REPLY_TYPE_STR, PROC_TYPE, PROC_TYPE_STR } from '@/constants';

export default {
  name: 'QuestionDetail',

  data() {
    return {
      drawerVisible: false,
      form: {
        title: '',
        keyword: '',
        reply_type: 0,
        process_type: 0,
        choices: []
      },
      search: '',
      procTypeColor: {
        [PROC_TYPE.ORDINARY]: 'primary',
        [PROC_TYPE.GRATITUDE_JOURNAL]: 'warning',
        [PROC_TYPE.MOOD_RECORD]: 'success',
        [PROC_TYPE.NICKNAME]: 'danger',
      },
    };
  },

  computed: {
    REPLY_TYPE_STR() {
      return REPLY_TYPE_STR;
    },
    PROC_TYPE_STR() {
      return PROC_TYPE_STR;
    }
  },

  mounted() {
    this.fetchDetail();
  },
  methods: {
    fetchDetail() {
      new QuestionProxy().getItem(this.$route.params.id)
        .then(res => {
          Object.assign(this.form, res);
        })
        .catch(err => {
          console.log(err);
          this.$message.error('获取问题数据失败');
        });
    },
    updateQuestion() {
      new QuestionProxy().updateItem(this.form)
        .then(res => {
          this.$notify({
            title: '成功',
            message: '修改问题数据成功',
            type: 'success'
          });
          Object.assign(this.form, res);
        })
        .catch(err => {
          console.log(err);
          this.$message.error('修改问题数据失败');
        });
    },
    jumpQuestion(questionID) {
      console.log(questionID);
      this.$router.push({
        name: 'question.detail',
        params: {
          id: questionID,
        }
      });
      this.fetchDetail();
    },
    deleteChoice(choiceId) {
      console.log(choiceId);
    }
  },
};
</script>

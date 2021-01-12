<template>
  <el-row
    v-loading="loading"
    type="flex"
  >
    <el-col :span="24">
      <el-button
        type="primary"
        style="margin-left: 16px;"
        @click="drawerVisible = true"
      >
        看提示
      </el-button>
      <el-divider>问题信息</el-divider>
      <h2>问题ID: {{ this.$route.params.id }}</h2>
      <el-form
        ref="form"
        :model="form"
        label-width="80px"
      >
        <el-form-item label="问题标题">
          <el-input
            v-model="form.title"
            :rows="3"
            type="textarea"
          />
        </el-form-item>
        <el-form-item label="关键词">
          <el-input
            v-model="form.keyword"
            placeholder="以逗号分隔"
          />
        </el-form-item>
        <el-form-item label="回复类型">
          <el-select
            v-model="form.reply_type"
            placeholder="请选择回复类型"
          >
            <el-option
              v-for="(value, name) in REPLY_TYPE_STR"
              :key="name"
              :label="value"
              :value="name * 1"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="处理类型">
          <el-select
            v-model="form.process_type"
            placeholder="请选择处理类型"
          >
            <el-option
              v-for="(value, name) in PROC_TYPE_STR"
              :key="name"
              :label="value"
              :value="name * 1"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="根问题">
          <el-switch
            v-model="form.root"
            active-color="#13ce66"
            inactive-color="#ff4949"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            style="width: 100%"
            @click="updateQuestion"
          >
            更新
          </el-button>
        </el-form-item>
      </el-form>
      <el-divider>问题选项</el-divider>
      <el-button
        type="primary"
        icon="el-icon-plus"
        @click="initChoice"
      >
        新建选项
      </el-button>
      <el-row
        :gutter="12"
        style="margin-top: 20px"
      >
        <el-col
          v-for="item in form.choices"
          :key="item.id"
          :span="6"
        >
          <el-card shadow="hover">
            <div slot="header">
              <span>{{ item.title }}</span>
              <el-button
                style="float: right; padding: 3px 0"
                type="text"
                @click="editChoice(item)"
              >
                编辑
              </el-button>
            </div>
            <div>
              <p>回复: {{ item.reply_content }}</p>
              <p>下个问题: {{ item.dest_question ? item.dest_question__title : '无' }}</p>
              <el-row
                :gutter="10"
                style="margin-top: 10px"
              >
                <el-col :span="12">
                  <el-button
                    v-if="item.dest_question"
                    type="primary"
                    style="width: 100%"
                    size="mini"
                    @click="jumpQuestion(item.dest_question)"
                  >
                    跳转
                  </el-button>
                </el-col>
                <el-col :span="12">
                  <el-popconfirm
                    title="确定删除吗？"
                    icon-color="red"
                    @confirm="deleteChoice(item.id)"
                  >
                    <el-button
                      slot="reference"
                      type="danger"
                      style="width: 100%"
                      size="mini"
                    >
                      删除
                    </el-button>
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
          <li>
            回复类型
            <ul>
              <li>文本: 聊天界面回复框为文本框</li>
              <li>选项: 聊天界面回复框为几个选项</li>
            </ul>
          </li>
          <li>
            处理类型（心情日记仅对选项回复生效，其余仅对文本回复生效）
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

    <el-dialog
      title="新建选项"
      :visible.sync="dialogFormVisible"
    >
      <el-form :model="editingChoice">
        <el-form-item label="选项标题">
          <el-input v-model="editingChoice.title" />
        </el-form-item>
        <el-form-item label="回复内容">
          <el-input v-model="editingChoice.reply_content" />
        </el-form-item>
        <el-form-item label="指向问题">
          <el-select
            v-model="editingChoice.dest_question"
            filterable
            remote
            placeholder="请输入问题关键词"
            :remote-method="remoteMethod"
            :loading="selectLoading"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.title"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="createOrUpdateChoice"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import QuestionProxy from '@/proxies/QuestionProxy';
import { REPLY_TYPE, REPLY_TYPE_STR, PROC_TYPE, PROC_TYPE_STR } from '@/constants';
import ChoiceProxy from '@/proxies/ChoiceProxy';

export default {
  name: 'QuestionDetail',

  data() {
    return {
      loading: false,
      drawerVisible: false,
      dialogFormVisible: false,
      selectLoading: false,
      form: {
        title: '',
        keyword: '',
        reply_type: 0,
        process_type: 0,
        root: false,
        choices: []
      },
      editingChoice: {
        id: null,
        title: '',
        reply_content: '',
        dest_question: null
      },
      options: [],
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
      this.loading = true;
      new QuestionProxy().getItem(this.$route.params.id)
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
    updateQuestion() {
      this.loading = true;
      new QuestionProxy().updateItem(this.form)
        .then(res => {
          this.$notify({
            title: '成功',
            message: '修改问题数据成功',
            type: 'success'
          });
          this.fetchDetail();
        })
        .catch(err => {
          this.$message.error('修改问题数据失败');
        })
        .finally(() => {
          this.loading = false;
        });
    },
    jumpQuestion(questionID) {
      this.$router.push({
        name: 'question.detail',
        params: {
          id: questionID,
        }
      });
      this.fetchDetail();
    },
    deleteChoice(choiceId) {
      this.loading = true;
      new ChoiceProxy().delete(choiceId)
        .then(res => {
          this.$notify.success({
            title: '成功',
            message: '成功删除选项'
          });
          this.fetchDetail();
        })
        .catch(err => {
          this.$message.error('获取问题数据失败');
        })
        .finally(() => {
          this.loading = false;
        });
    },
    remoteMethod(query) {
      if (query !== '') {
        this.selectLoading = true;
        new QuestionProxy({ title: query }).getList({
          page: 0,
          count: 10
        })
          .then(res => {
            this.options = res;
          })
          .catch(err => {
            this.$message.error('获取问题数据失败');
          })
          .finally(() => {
            this.selectLoading = false;
          });
      } else {
        this.options = [];
      }
    },
    initChoice() {
      this.editingChoice = {
        id: null,
        title: '',
        reply_content: '',
        dest_question: null
      };
      this.dialogFormVisible = true;
    },
    editChoice(item) {
      this.editingChoice.id = item.id;
      this.editingChoice.title = item.title;
      this.editingChoice.reply_content = item.reply_content;
      this.editingChoice.dest_question = item.dest_question;
      this.remoteMethod(item.dest_question__title);
      this.dialogFormVisible = true;
    },
    createOrUpdateChoice() {
      this.loading = true;
      if (this.editingChoice.id) {
        new ChoiceProxy().update(this.editingChoice.id, {
          question: this.$route.params.id,
          ...this.editingChoice,
        })
          .then(res => {
            this.$notify.success({
              title: '成功',
              message: '成功更新选项'
            });
            this.fetchDetail();
          })
          .catch(err => {
            this.$message.error('更新选项失败');
          })
          .finally(() => {
            this.loading = false;
            this.dialogFormVisible = false;
          });
      } else {
        new ChoiceProxy().create({
          question: this.$route.params.id,
          ...this.editingChoice,
        })
          .then(res => {
            this.$notify.success({
              title: '成功',
              message: '成功创建选项'
            });
            this.fetchDetail();
          })
          .catch(err => {
            this.$message.error('创建选项失败');
          })
          .finally(() => {
            this.loading = false;
            this.dialogFormVisible = false;
          });
      }
    }
  },
};
</script>

<style>
.el-card__body {
  padding-top: 0 !important;
}
</style>

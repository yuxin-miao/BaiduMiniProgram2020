<template>
  <el-row>
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="search" placeholder="输入标题"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button
          @click="initQuestion"
          type="primary"
          icon="el-icon-plus"
        >
          新建问题
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column
        label="ID"
        prop="id"
        width="100"
      >
      </el-table-column>
      <el-table-column
        label="标题"
        prop="title"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="reply_type"
        label="回复类型"
        width="100">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.reply_type === 0 ? 'info' : 'primary'"
            disable-transitions>{{ REPLY_TYPE_STR[scope.row.reply_type] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="process_type"
        label="处理类型"
        width="120">
        <template slot-scope="scope">
          <el-tag
            :type="procTypeColor[scope.row.process_type]"
            disable-transitions>{{ PROC_TYPE_STR[scope.row.process_type] }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="root"
        label="根问题"
        width="120">
        <template slot-scope="scope">
          <i class="el-icon-check" v-if="scope.row.root"></i>
          <i class="el-icon-close" v-else></i>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            style="margin-right: 5px"
            @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-popconfirm
            title="确定删除吗？"
            icon-color="red"
            @confirm="handleDelete(scope.$index, scope.row)"
          >
            <el-button
              size="mini"
              type="danger"
              slot="reference"
            >
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="新建问题" :visible.sync="dialogFormVisible">
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
        <el-form-item label="根问题">
          <el-switch
            v-model="form.root"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createQuestion">确 定</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>
import QuestionProxy from '@/proxies/QuestionProxy';
import { REPLY_TYPE, REPLY_TYPE_STR, PROC_TYPE, PROC_TYPE_STR } from '@/constants';

export default {
  name: 'Question',

  data() {
    return {
      tableData: [],
      search: '',
      loading: false,
      dialogFormVisible: false,
      form: {
        title: '',
        keyword: '',
        reply_type: 0,
        process_type: 0,
        root: false,
      },
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
    this.fetchQuestions();
  },
  methods: {
    fetchQuestions() {
      this.loading = true;
      new QuestionProxy().getList({
        page: 0,
        count: 10
      })
        .then(res => {
          this.tableData = res;
        })
        .catch(err => {
          console.log(err);
          this.$message.error('获取问题数据失败');
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleEdit(index, row) {
      this.$router.push({
        name: 'question.detail',
        params: {
          id: row.id,
        }
      });
    },
    handleDelete(index, row) {
      new QuestionProxy().delete(row.id)
        .then(res => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success'
          });
          this.fetchQuestions();
        })
        .catch(err => {
          console.log(err);
          this.$message.error('删除问题失败');
        });
    },
    handleSearch() {
      new QuestionProxy({ title: this.search }).getList({
        page: 0,
        count: 10
      })
        .then(res => {
          this.tableData = res;
        })
        .catch(err => {
          console.log(err);
          this.$message.error('获取问题数据失败');
        });
    },
    initQuestion() {
      this.form = {
        title: '',
        keyword: '',
        reply_type: 0,
        process_type: 0,
        root: false,
      };
      this.dialogFormVisible = true;
    },
    createQuestion() {
      new QuestionProxy().create(this.form)
        .then(res => {
          this.$notify({
            title: '成功',
            message: '新建成功',
            type: 'success'
          });
          this.fetchQuestions();
          this.dialogFormVisible = false;
        })
        .catch(err => {
          console.log(err);
          this.$message.error('新建问题失败');
        });
    }
  },
};
</script>

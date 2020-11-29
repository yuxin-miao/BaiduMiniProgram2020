<template>
  <el-row>
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="search" placeholder="输入标题"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        label="ID"
        prop="id"
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
      console.log(this.search);
    }
  },
};
</script>

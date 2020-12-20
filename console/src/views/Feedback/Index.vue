<template>
  <el-row>
    <el-table
      v-loading="loading"
      :data="tableData"
      style="width: 100%"
    >
      <el-table-column
        label="ID"
        prop="id"
        width="100"
      />
      <el-table-column
        label="用户"
        prop="user"
        show-overflow-tooltip
      />
      <el-table-column
        label="创建时间"
        prop="created_at"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          {{
            `${new Date(scope.row.created_at).toLocaleDateString()} ${new Date(scope.row.created_at).toLocaleTimeString()}`
          }}
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            style="margin-right: 5px"
            @click="handleEdit(scope.$index, scope.row)"
          >
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-row>
</template>

<script>
import FeedbackProxy from '@/proxies/FeedbackProxy';

export default {
  name: 'Feedback',

  data() {
    return {
      tableData: [],
      search: '',
      loading: false,
    };
  },
  mounted() {
    this.fetchFeedbacks();
  },
  methods: {
    fetchFeedbacks() {
      this.loading = true;
      new FeedbackProxy().all()
        .then(res => {
          this.tableData = res;
        })
        .catch(err => {
          this.$message.error('获取用户反馈数据失败');
        })
        .finally(() => {
          this.loading = false;
        });
    },
    handleEdit(index, row) {
      this.$router.push({
        name: 'feedback.detail',
        params: {
          id: row.id,
        }
      });
    },
  },
};
</script>

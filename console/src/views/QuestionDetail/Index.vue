<template>
  <el-row>
    <h1>Detail of {{ $route.params.id }}</h1>
  </el-row>
</template>

<script>
import QuestionProxy from '@/proxies/QuestionProxy';
import { REPLY_TYPE, REPLY_TYPE_STR, PROC_TYPE, PROC_TYPE_STR } from '@/constants';

export default {
  name: 'QuestionDetail',

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
    this.fetchDetail();
  },
  methods: {
    fetchDetail() {
      new QuestionProxy().getItem(this.$route.params.id)
        .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
          this.$message.error('获取问题数据失败');
        });
    },
  },
};
</script>

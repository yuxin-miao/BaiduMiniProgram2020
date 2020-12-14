export const REPLY_TYPE = {
  RAW: 0,
  CHOICE: 1,
};

export const REPLY_TYPE_STR = {
  [REPLY_TYPE.RAW]: '文本',
  [REPLY_TYPE.CHOICE]: '选项',
};

export const PROC_TYPE = {
  ORDINARY: 0,
  GRATITUDE_JOURNAL: 1,
  MOOD_RECORD: 2,
  NICKNAME: 3,
  ROBOT: 4
};

export const PROC_TYPE_STR = {
  [PROC_TYPE.ORDINARY]: '普通',
  [PROC_TYPE.GRATITUDE_JOURNAL]: '感恩日志',
  [PROC_TYPE.MOOD_RECORD]: '心情记录',
  [PROC_TYPE.NICKNAME]: '输入昵称',
  [PROC_TYPE.ROBOT]: '机器人',
};

class ReplyType:
    RAW = 0
    CHOICE = 1

    choices = (
        (RAW, '文本'),
        (CHOICE, '选项'),
    )


class ProcessType:
    ORDINARY = 0
    GRATITUDE_JOURNAL = 1
    MOOD_RECORD = 2
    NICKNAME = 3
    ROBOT = 4

    choices = (
        (ORDINARY, '普通匹配'),
        (GRATITUDE_JOURNAL, '感恩日志'),
        (MOOD_RECORD, '心情记录'),
        (NICKNAME, '输入昵称'),
        (ROBOT, '机器人问答')
    )

const translations = {
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.news': 'News',
    'nav.forum': 'Forum',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.logout': 'Logout',
    'nav.profile': 'Profile',
    'brand.name': 'BlockCraft MC',

    // Footer
    'footer.copyright': '© 2026 BlockCraft MC Server. All rights reserved.',
    'footer.disclaimer': 'Not affiliated with Mojang Studios',

    // Loading
    'loading': 'Loading...',

    // Home page
    'home.hero.title': 'BlockCraft MC',
    'home.hero.subtitle': 'A survival community server — build, explore, and thrive together!',
    'home.hero.version': 'Minecraft 1.21 · Java Edition · Click to copy IP',
    'home.features.title': 'Server Features',
    'home.features.grief.title': 'Grief Protection',
    'home.features.grief.desc': 'Claim your land and keep your builds safe with our advanced protection system.',
    'home.features.economy.title': 'Player Economy',
    'home.features.economy.desc': 'Trade with other players, set up shops, and build your fortune on the server.',
    'home.features.world.title': 'Custom World',
    'home.features.world.desc': 'Explore a hand-crafted world with custom biomes, structures, and secrets.',
    'home.features.community.title': 'Friendly Community',
    'home.features.community.desc': 'Join a welcoming community of builders, explorers, and redstone engineers.',
    'home.features.uptime.title': '24/7 Uptime',
    'home.features.uptime.desc': 'Our server runs 24/7 on dedicated hardware with regular backups.',
    'home.features.events.title': 'Regular Events',
    'home.features.events.desc': 'Participate in build contests, PvP tournaments, and seasonal events.',
    'home.news.title': 'Latest News',
    'home.news.empty': 'No news articles yet. Check back soon!',
    'home.news.viewAll': 'View All',

    // Login page
    'login.title': 'Login',
    'login.email': 'Email',
    'login.password': 'Password',
    'login.submit': 'Login',
    'login.submitting': 'Logging in...',
    'login.noAccount': "Don't have an account?",
    'login.registerLink': 'Register here',
    'login.error.default': 'Login failed',

    // Register page
    'register.title': 'Register',
    'register.username': 'Username',
    'register.email': 'Email',
    'register.password': 'Password',
    'register.confirmPassword': 'Confirm Password',
    'register.submit': 'Register',
    'register.submitting': 'Registering...',
    'register.hasAccount': 'Already have an account?',
    'register.loginLink': 'Login here',
    'register.error.mismatch': 'Passwords do not match',
    'register.error.usernameLength': 'Username must be at least 3 characters',
    'register.error.passwordLength': 'Password must be at least 6 characters',
    'register.error.default': 'Registration failed',
    'register.success': 'Registration successful! Redirecting to login...',

    // News list
    'news.list.title': 'Server News',
    'news.list.empty': 'No news articles yet.',
    'news.list.create': 'Create Article',
    'news.list.edit': 'Edit',
    'news.list.delete': 'Delete',
    'news.list.deleteConfirm': 'Delete this article?',
    'news.list.deleteFailed': 'Failed to delete article',
    'news.list.prev': 'Prev',
    'news.list.next': 'Next',
    'news.list.page': 'Page {page} / {total}',

    // News detail
    'news.detail.back': 'Back to News',
    'news.detail.by': 'By',
    'news.detail.updated': 'Updated:',
    'news.detail.edit': 'Edit',
    'news.detail.delete': 'Delete',
    'news.detail.deleteConfirm': 'Delete this article?',
    'news.detail.deleteFailed': 'Failed to delete',

    // News create
    'news.create.title': 'Create News Article',
    'news.create.titleLabel': 'Title',
    'news.create.contentLabel': 'Content',
    'news.create.submit': 'Publish',
    'news.create.submitting': 'Publishing...',
    'news.create.cancel': 'Cancel',
    'news.create.error': 'Failed to create article',

    // News edit
    'news.edit.title': 'Edit News Article',
    'news.edit.titleLabel': 'Title',
    'news.edit.contentLabel': 'Content',
    'news.edit.submit': 'Save Changes',
    'news.edit.submitting': 'Saving...',
    'news.edit.cancel': 'Cancel',
    'news.edit.error': 'Failed to update article',

    // Forum
    'forum.title': 'Forum',
    'forum.topics': 'topics',
    'forum.delete': 'Delete',
    'forum.deleteConfirm': 'Delete this category and all its topics?',
    'forum.deleteFailed': 'Failed to delete category',

    // Category page
    'category.back': 'Back to Forum',
    'category.newTopic': 'New Topic',
    'category.empty': 'No topics yet. Be the first to create one!',
    'category.by': 'by',
    'category.replies': 'replies',
    'category.last': 'Last:',
    'category.prev': 'Prev',
    'category.next': 'Next',
    'category.page': 'Page {page} / {total}',

    // Topic page
    'topic.back': 'Back to {category}',
    'topic.deleteTopic': 'Delete Topic',
    'topic.deleteTopicConfirm': 'Delete this entire topic?',
    'topic.deleteTopicFailed': 'Failed to delete topic',
    'topic.postedBy': 'Posted by',
    'topic.edited': '(edited)',
    'topic.edit': 'Edit',
    'topic.editSave': 'Save',
    'topic.editCancel': 'Cancel',
    'topic.delete': 'Delete',
    'topic.deleteConfirm': 'Delete this post?',
    'topic.deleteFailed': 'Failed to delete post',
    'topic.updateFailed': 'Failed to update post',
    'topic.reply.title': 'Post a Reply',
    'topic.reply.placeholder': 'Write your reply...',
    'topic.reply.submit': 'Post Reply',
    'topic.reply.submitting': 'Posting...',
    'topic.reply.error': 'Failed to post reply',
    'topic.loginToReply': 'Login',
    'topic.loginToReplyText': ' to post a reply.',
    'topic.prev': 'Prev',
    'topic.next': 'Next',
    'topic.page': 'Page {page} / {total}',

    // Create topic
    'createTopic.title': 'Create New Topic',
    'createTopic.titleLabel': 'Title',
    'createTopic.contentLabel': 'Content',
    'createTopic.submit': 'Create Topic',
    'createTopic.submitting': 'Creating...',
    'createTopic.cancel': 'Cancel',
    'createTopic.error': 'Failed to create topic',

    // Profile
    'profile.title': 'My Profile',
    'profile.username': 'Username',
    'profile.email': 'Email',
    'profile.role': 'Role',
    'profile.role.admin': 'Admin',
    'profile.role.player': 'Player',
    'profile.changePassword': 'Change Password',
    'profile.currentPassword': 'Current Password',
    'profile.newPassword': 'New Password',
    'profile.passwordChanged': 'Password changed successfully!',
    'profile.passwordError': 'Failed to change password',

    // 404
    'notFound.title': '404 — Chunk Not Found',
    'notFound.message': 'You seem to have wandered into unloaded chunks. This page does not exist.',
    'notFound.button': 'Return to Spawn',

    // Copy IP
    'copy.success': 'Server IP copied!',

    // Likes & Images
    'like': 'Like',
    'unlike': 'Unlike',
    'floor': '#{num}',
    'image.upload': 'Upload Image',
    'image.remove': 'Remove',
    'image.none': 'No image selected',
  },

  zh: {
    // Navbar
    'nav.home': '首页',
    'nav.news': '新闻',
    'nav.forum': '论坛',
    'nav.login': '登录',
    'nav.register': '注册',
    'nav.logout': '退出',
    'nav.profile': '个人中心',
    'brand.name': 'BlockCraft MC',

    // Footer
    'footer.copyright': '© 2026 BlockCraft MC 服务器 版权所有',
    'footer.disclaimer': '与 Mojang Studios 无关联',

    // Loading
    'loading': '加载中...',

    // Home page
    'home.hero.title': 'BlockCraft MC',
    'home.hero.subtitle': '一个生存社区服务器 — 建造、探索、共同繁荣！',
    'home.hero.version': 'Minecraft 1.21 · Java版 · 点击复制IP',
    'home.features.title': '服务器特色',
    'home.features.grief.title': '领地保护',
    'home.features.grief.desc': '使用先进的保护系统圈定领地，让你的建筑安全无忧。',
    'home.features.economy.title': '玩家经济',
    'home.features.economy.desc': '与其他玩家交易，开设商店，在服务器中积累你的财富。',
    'home.features.world.title': '自定义世界',
    'home.features.world.desc': '探索精心打造的世界，包含自定义生物群系、建筑和秘密。',
    'home.features.community.title': '友好社区',
    'home.features.community.desc': '加入一个由建造者、探险家和红石工程师组成的热情社区。',
    'home.features.uptime.title': '全天候运行',
    'home.features.uptime.desc': '服务器7×24小时运行在专用硬件上，定期备份数据。',
    'home.features.events.title': '定期活动',
    'home.features.events.desc': '参与建筑比赛、PvP锦标赛和季节性活动。',
    'home.news.title': '最新新闻',
    'home.news.empty': '暂无新闻，请稍后再来！',
    'home.news.viewAll': '查看全部',

    // Login page
    'login.title': '登录',
    'login.email': '邮箱',
    'login.password': '密码',
    'login.submit': '登录',
    'login.submitting': '登录中...',
    'login.noAccount': '还没有账号？',
    'login.registerLink': '立即注册',
    'login.error.default': '登录失败',

    // Register page
    'register.title': '注册',
    'register.username': '用户名',
    'register.email': '邮箱',
    'register.password': '密码',
    'register.confirmPassword': '确认密码',
    'register.submit': '注册',
    'register.submitting': '注册中...',
    'register.hasAccount': '已有账号？',
    'register.loginLink': '立即登录',
    'register.error.mismatch': '两次输入的密码不一致',
    'register.error.usernameLength': '用户名至少需要3个字符',
    'register.error.passwordLength': '密码至少需要6个字符',
    'register.error.default': '注册失败',
    'register.success': '注册成功！正在跳转到登录页...',

    // News list
    'news.list.title': '服务器新闻',
    'news.list.empty': '暂无新闻文章。',
    'news.list.create': '发布文章',
    'news.list.edit': '编辑',
    'news.list.delete': '删除',
    'news.list.deleteConfirm': '确定要删除这篇文章吗？',
    'news.list.deleteFailed': '删除文章失败',
    'news.list.prev': '上一页',
    'news.list.next': '下一页',
    'news.list.page': '第 {page} 页 / 共 {total} 页',

    // News detail
    'news.detail.back': '返回新闻列表',
    'news.detail.by': '作者',
    'news.detail.updated': '更新于：',
    'news.detail.edit': '编辑',
    'news.detail.delete': '删除',
    'news.detail.deleteConfirm': '确定要删除这篇文章吗？',
    'news.detail.deleteFailed': '删除失败',

    // News create
    'news.create.title': '发布新闻',
    'news.create.titleLabel': '标题',
    'news.create.contentLabel': '内容',
    'news.create.submit': '发布',
    'news.create.submitting': '发布中...',
    'news.create.cancel': '取消',
    'news.create.error': '发布文章失败',

    // News edit
    'news.edit.title': '编辑新闻',
    'news.edit.titleLabel': '标题',
    'news.edit.contentLabel': '内容',
    'news.edit.submit': '保存修改',
    'news.edit.submitting': '保存中...',
    'news.edit.cancel': '取消',
    'news.edit.error': '更新文章失败',

    // Forum
    'forum.title': '论坛',
    'forum.topics': '个主题',
    'forum.delete': '删除',
    'forum.deleteConfirm': '确定要删除此板块及其所有主题吗？',
    'forum.deleteFailed': '删除板块失败',

    // Category page
    'category.back': '返回论坛',
    'category.newTopic': '发新帖',
    'category.empty': '暂无主题，快来发布第一个吧！',
    'category.by': '由',
    'category.replies': '条回复',
    'category.last': '最后回复：',
    'category.prev': '上一页',
    'category.next': '下一页',
    'category.page': '第 {page} 页 / 共 {total} 页',

    // Topic page
    'topic.back': '返回{category}',
    'topic.deleteTopic': '删除主题',
    'topic.deleteTopicConfirm': '确定要删除整个主题吗？',
    'topic.deleteTopicFailed': '删除主题失败',
    'topic.postedBy': '发布者',
    'topic.edited': '（已编辑）',
    'topic.edit': '编辑',
    'topic.editSave': '保存',
    'topic.editCancel': '取消',
    'topic.delete': '删除',
    'topic.deleteConfirm': '确定要删除此回复吗？',
    'topic.deleteFailed': '删除回复失败',
    'topic.updateFailed': '更新回复失败',
    'topic.reply.title': '发表回复',
    'topic.reply.placeholder': '写下你的回复...',
    'topic.reply.submit': '发表回复',
    'topic.reply.submitting': '发表中...',
    'topic.reply.error': '发表回复失败',
    'topic.loginToReply': '登录',
    'topic.loginToReplyText': '后即可回复。',
    'topic.prev': '上一页',
    'topic.next': '下一页',
    'topic.page': '第 {page} 页 / 共 {total} 页',

    // Create topic
    'createTopic.title': '发布新主题',
    'createTopic.titleLabel': '标题',
    'createTopic.contentLabel': '内容',
    'createTopic.submit': '发布主题',
    'createTopic.submitting': '发布中...',
    'createTopic.cancel': '取消',
    'createTopic.error': '发布主题失败',

    // Profile
    'profile.title': '个人中心',
    'profile.username': '用户名',
    'profile.email': '邮箱',
    'profile.role': '角色',
    'profile.role.admin': '管理员',
    'profile.role.player': '玩家',
    'profile.changePassword': '修改密码',
    'profile.currentPassword': '当前密码',
    'profile.newPassword': '新密码',
    'profile.passwordChanged': '密码修改成功！',
    'profile.passwordError': '密码修改失败',

    // 404
    'notFound.title': '404 — 区块未找到',
    'notFound.message': '你似乎走进了未加载的区块，此页面不存在。',
    'notFound.button': '返回出生点',

    // Copy IP
    'copy.success': '服务器IP已复制！',

    // Likes & Images
    'like': '点赞',
    'unlike': '取消点赞',
    'floor': '第{num}楼',
    'image.upload': '上传图片',
    'image.remove': '移除',
    'image.none': '未选择图片',
  },
}

export default translations

import MenuFactory from '@/components/common/MenuFactory';

const FirstMenu = MenuFactory({
  menuList: [
    { key: '/', icon: 'home', title: '概览' },
    { key: '/courses', icon: 'book', title: '课程' },
    { key: '/notification', icon: 'bell', title: '消息' },
    { key: '/setting', icon: 'setting', title: '设置' },
    { key: '/feedback', icon: 'smile-o', title: '反馈' }
  ]
});

export default FirstMenu;

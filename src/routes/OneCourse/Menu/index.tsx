import MenuFactory from '@/components/common/MenuFactory';

const OneCourseMenu = MenuFactory({
  menuList: [
    { key: '/home', icon: 'area-chart', title: '详情概览' },
    { key: '/assignments', icon: 'edit', title: '作业' },
    { key: '/discussions', icon: 'coffee', title: '讨论' }
  ],
  returnTo: () => '/courses'
});

export default OneCourseMenu;

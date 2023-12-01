import  mount  from '@nuxt/test-utils';
import Login from '@/components/Login.vue';

describe('Login', () => {
  test('renders correctly', async () => {
    const wrapper = mount(Login);
    await wrapper.vm.$nextTick();
    expect(wrapper.html()).toContain('');
  });
});

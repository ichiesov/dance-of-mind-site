'use client';

export const createAppStore = (props) => {
  return {
    test: props.test || 'Hello world',
    toggleTest: function () {
      this.test = this.test === 'Hi!' ? 'How are you?' : 'Hi!';
    },
  };
};

import { configure, defineRule } from 'vee-validate';
import { localize, setLocale } from '@vee-validate/i18n';
import {
  required,
  min,
  max,
  numeric,
  min_value,
  max_value,
} from '@vee-validate/rules';

export default async () => {
  const zh_CN = await import('@vee-validate/i18n/dist/locale/zh_CN.json');

  configure({
    generateMessage: localize({
      zh_CN,
    }),
  });

  setLocale(zh_CN.code);

  defineRule('required', required);
  defineRule('min', min);
  defineRule('max', max);
  defineRule('numeric', numeric);
  defineRule('min_value', min_value);
  defineRule('max_value', max_value);
};

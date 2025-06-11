import {makeHmac} from './crypto';
import {describe, expect, it} from "@jest/globals";

describe('makeHmac 함수', () => {
  it('문자열과 비밀키로 올바른 HMAC을 생성해야 함', () => {
    const plainText = 'Hello, World!';
    const secretKey = 'my-secret-key';

    const result = makeHmac(plainText, secretKey);

    expect(result).toBe('zzFBYR4i6iapysb+QdlBJ03WZTYiyDy6E5ctF3vWlpk=');
  });

  it('문자열이 빈 문자열인경우, 빈 문자열이 반환되어야 함', () => {
    const plainText = '';
    const secretKey = 'my-secret-key';

    const result = makeHmac(plainText, secretKey);

    expect(result).toBe('');
  });

  it('비밀키가 빈 문자열인경우, 빈 문자열이 반환되어야 함', () => {
    const plainText = 'Hello, World!';
    const secretKey = '';

    const result = makeHmac(plainText, secretKey);

    expect(result).toBe('');
  });
});

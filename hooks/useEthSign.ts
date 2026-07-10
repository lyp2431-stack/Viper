import { useState } from 'react';
import { useIsMounted } from './useIsMounted';

export function useEthSign() {
  const isMounted = useIsMounted();
  const [signature, setSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const signMessage = async (message: string) => {
    if (!isMounted || !window.ethereum) {
      setError("کیف پولی پیدا نشد!");
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const fromAddress = accounts[0];

      // 1. تعریف دامنه (اسم سایتی که سبز رنگ میشه)
      const domain = {
        name: 'Viper', // اسم سایت خودت
        version: '1.0.0',
        chainId: parseInt(window.ethereum.chainId, 16) || 1, // خودش شبکه رو تشخیص میده
      };

      // 2. تعریف فیلد مخفی برای خالی نگه داشتن وسط پنجره
      const types = {
        Message: [
          { name: 'content', type: 'string' }
        ]
      };

      // 3. مقدار خالی
      const value = {
        content: '' // خالی گذاشتیم تا هیچی تو پنجره نشون نده
      };

      // 4. ارسال درخواست با متد جدید (personal_sign تایپ دیتا)
      const sig = await window.ethereum.request({
        method: 'eth_signTypedData_v4',
        params: [fromAddress, { types, domain, primaryType: 'Message', message: value }],
      });

      setSignature(sig);
      return sig;
    } catch (err: any) {
      setError(err.message || "خطا در امضا");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { signMessage, signature, error, loading };
}

import type { SupportCenter, SupportInformation } from '@/src/types';
import { mockSupportCenters } from '@/src/mock/supportCenters';

export interface SupportService {
  getSupportCenters(): Promise<SupportCenter[]>;
  getSupportInformation(): Promise<SupportInformation>;
}

export const mockSupportService: SupportService = {
  async getSupportCenters() {
    return mockSupportCenters;
  },
  async getSupportInformation() {
    return {
      yedam: {
        name: 'YEDAM (Yeşilay Danışmanlık Hattı)',
        phone: '115',
        description:
          'YEDAM, bağımlılık danışmanlığı sağlayan ücretsiz ve gizli bir destektir. Telefonla danışmanlık, yüz yüze görüşme ve online destek sunar.',
      },
      emergency115: {
        name: '115 Danışma Hattı',
        phone: '115',
        description:
          'Yeşilay Danışmanlık Hattı — bağımlılık konusunda uzman danışmanlık sağlar.',
      },
      yesilay: {
        name: 'Yeşilay',
        website: 'https://www.yesilay.org.tr',
        description:
          'Türkiye Yeşilay Cemiyeti, bağımlılıkla mücadele alanında çalışan sivil toplum kuruluşudur.',
      },
    };
  },
};

export const supportService: SupportService = mockSupportService;

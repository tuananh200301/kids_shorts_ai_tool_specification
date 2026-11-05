import { KidsCategory } from './types';

export type Language = 'en' | 'vi';

export interface Translations {
  header: {
    title: string;
    badge: string;
    subtitle: string;
    zeroSeamLoop: string;
    coppaKidSafe: string;
    pixar3D: string;
    trendsSimulated: string;
    trendsLive: string;
    aiProcedural: string;
    aiGemini: string;
    trendsTooltipSimulated: string;
    trendsTooltipLive: string;
    aiTooltipProcedural: string;
    aiTooltipGemini: string;
  };
  filterBar: {
    nicheLabel: string;
    trendWindowLabel: string;
    last24h: string;
    past7Days: string;
    conceptsLabel: string;
    conceptsCount: (count: number) => string;
    targetingPrefix: string;
    scanTrendsBtn: string;
    scanAndGenerateBtn: string;
    harvestingAndGeneratingBtn: string;
  };
  categories: Record<
    KidsCategory,
    {
      label: string;
      description: string;
    }
  >;
  trendingPanel: {
    title: string;
    timeframeDay: string;
    timeframeWeek: string;
    subtitle: string;
    copyAllTags: string;
    tagsCopied: string;
    topHashtagsTitle: string;
    clickToCopy: string;
    sensoryKeywordsTitle: string;
    benchmarkShortsTitle: string;
    sortedByViews: string;
    emptyText: string;
  };
  scriptCard: {
    sfxPrefix: string;
    copyBundle: string;
    bundleCopied: string;
    timelineTitle: string;
    hookTitle: string;
    hookBadge: string;
    actionTitle: string;
    actionBadge: string;
    loopTitle: string;
    loopBadge: string;
    imagePromptTitle: string;
    motionPromptTitle: string;
    copyImagePrompt: string;
    copyMotionPrompt: string;
    copyHashtags: string;
    promptCopied: string;
    tagsCopied: string;
    generateImageBtn: string;
    generatingImage: string;
    regenerateImage: string;
    downloadImage: string;
    previewBadge: string;
    viewFullscreen: string;
    close: string;
    youtubeSectionTitle: string;
    youtubeTitleLabel: string;
    youtubeDescLabel: string;
    copyTitleBtn: string;
    copyDescBtn: string;
    titleCopied: string;
    descCopied: string;
  };
  dashboard: {
    scriptsSectionTitle: string;
    readyBadge: (count: number) => string;
    scriptsSectionSubtitle: string;
    copyAllConcepts: string;
    noScriptsTitle: string;
    noScriptsText: string;
    generateNow: string;
    toastGenerated: (count: number) => string;
    toastCopiedAll: string;
    toastCopiedTag: (tag: string) => string;
    toastSelectedTag: (tag: string) => string;
    toastCopyFailed: string;
    footerText: string;
  };
  common: {
    copy: string;
    copied: string;
  };
}

export const translations: Record<Language, Translations> = {
  en: {
    header: {
      title: 'Kids Shorts AI Engine',
      badge: '5-7s Loop',
      subtitle: 'YouTube Kids Trend Harvester & Pixar-Style Midjourney / Kling Video Prompt Generator',
      zeroSeamLoop: 'Zero-Seam Loop',
      coppaKidSafe: 'COPPA Kid-Safe',
      pixar3D: 'Pixar 3D Prompting',
      trendsSimulated: 'Trends: Simulated',
      trendsLive: 'Trends: Live v3',
      aiProcedural: 'AI: Procedural',
      aiGemini: 'AI: Gemini 2.5',
      trendsTooltipSimulated: 'Simulated trend analytics (add YOUTUBE_API_KEY in .env.local for live data)',
      trendsTooltipLive: 'Live YouTube Data API v3 connected',
      aiTooltipProcedural: 'Procedural AI scripts (add GEMINI_API_KEY in .env.local for live Gemini)',
      aiTooltipGemini: 'Live Google Gemini 2.5 connected',
    },
    filterBar: {
      nicheLabel: 'Select Kids Shorts Niche',
      trendWindowLabel: 'Trend Window',
      last24h: 'Last 24h',
      past7Days: 'Past 7 Days',
      conceptsLabel: 'Concepts',
      conceptsCount: (c) => `${c} Concepts`,
      targetingPrefix: 'Targeting:',
      scanTrendsBtn: 'Scan Trends',
      scanAndGenerateBtn: 'Scan Trends & Generate Scripts',
      harvestingAndGeneratingBtn: 'Harvesting & Generating...',
    },
    categories: {
      animals: {
        label: 'Cute Animals',
        description: 'Chubby baby animals doing clumsy, delightful, and funny actions',
      },
      colors: {
        label: 'Color Learning',
        description: 'Vibrant color transformations, jelly splashing, and object reveals',
      },
      vehicles: {
        label: 'Funny Vehicles',
        description: 'Bouncy monster trucks, smiling fire engines, and friendly construction cars',
      },
      nursery_fun: {
        label: 'Nursery Rhyme Fun',
        description: 'Catchy rhythmic micro-actions inspired by nursery rhymes and baby games',
      },
      surprises: {
        label: 'Surprise Eggs & Magic',
        description: 'Cracking colorful surprise eggs, mystery gift boxes, and popping bubbles',
      },
    },
    trendingPanel: {
      title: 'Trending Intelligence',
      timeframeDay: 'Last 24h',
      timeframeWeek: 'Past 7 Days',
      subtitle: 'High-velocity tags & breakout shorts',
      copyAllTags: 'Copy All Tags',
      tagsCopied: 'Tags Copied!',
      topHashtagsTitle: 'Top High-Velocity Hashtags',
      clickToCopy: 'Click to copy',
      sensoryKeywordsTitle: 'High-Performing Sensory Keywords',
      benchmarkShortsTitle: 'Top Performing Benchmark Shorts',
      sortedByViews: 'Sorted by views',
      emptyText: 'Click "Scan Trends & Generate Scripts" to analyze trending shorts.',
    },
    scriptCard: {
      sfxPrefix: 'SFX:',
      copyBundle: 'Copy Script Bundle',
      bundleCopied: 'Bundle Copied!',
      timelineTitle: '5-7s Micro-Pacing Timeline',
      hookTitle: '0-2s Instant Hook',
      hookBadge: 'Scroll-Stopper',
      actionTitle: '2-5s Sensory Action',
      actionBadge: 'Engagement',
      loopTitle: '5-7s Loop Payoff',
      loopBadge: 'Zero-Seam',
      imagePromptTitle: 'Midjourney / Flux Keyframe Prompt (Pixar 3D)',
      motionPromptTitle: 'Kling / Runway Gen-3 / Pika Motion Prompt (Looping)',
      copyImagePrompt: 'Copy Image Prompt',
      copyMotionPrompt: 'Copy Motion Prompt',
      copyHashtags: 'Copy Hashtags',
      promptCopied: 'Prompt Copied!',
      tagsCopied: 'Tags Copied!',
      generateImageBtn: 'Generate AI Preview',
      generatingImage: 'Rendering Image...',
      regenerateImage: 'Regenerate',
      downloadImage: 'Download',
      previewBadge: 'AI Visual Preview (9:16)',
      viewFullscreen: 'Expand View',
      close: 'Close',
      youtubeSectionTitle: 'YouTube Upload Metadata (Title & Description)',
      youtubeTitleLabel: 'YouTube Video Title',
      youtubeDescLabel: 'YouTube Description',
      copyTitleBtn: 'Copy Title',
      copyDescBtn: 'Copy Description',
      titleCopied: 'Title Copied!',
      descCopied: 'Description Copied!',
    },
    dashboard: {
      scriptsSectionTitle: '5-7s Script Concepts & Generation Prompts',
      readyBadge: (count) => `${count} Ready`,
      scriptsSectionSubtitle: 'High-retention circular loops formatted for Midjourney + Kling / Runway',
      copyAllConcepts: 'Copy All Concepts',
      noScriptsTitle: 'No script concepts yet',
      noScriptsText: 'Click "Scan Trends & Generate Scripts" to analyze trending videos and produce 5-7s Pixar 3D prompts.',
      generateNow: 'Generate Now',
      toastGenerated: (count) => `Generated ${count} looping short concepts!`,
      toastCopiedAll: 'All scripts copied to clipboard!',
      toastCopiedTag: (tag) => `Copied ${tag} to clipboard!`,
      toastSelectedTag: (tag) => `Selected ${tag}`,
      toastCopyFailed: 'Failed to copy scripts to clipboard',
      footerText: 'AI Kids Shorts Trend Harvester & Script Generator • Optimized for 5-7s Midjourney, Kling, Runway & Pika workflows.',
    },
    common: {
      copy: 'Copy',
      copied: 'Copied!',
    },
  },
  vi: {
    header: {
      title: 'Kids Shorts AI Engine',
      badge: 'Vòng lặp 5-7s',
      subtitle: 'Trình thu thập xu hướng YouTube Kids & Tạo prompt video Pixar 3D cho Midjourney / Kling',
      zeroSeamLoop: 'Vòng lặp liền mạch',
      coppaKidSafe: 'Chuẩn an toàn COPPA',
      pixar3D: 'Chuẩn hoạt hình Pixar 3D',
      trendsSimulated: 'Xu hướng: Mô phỏng',
      trendsLive: 'Xu hướng: Trực tiếp v3',
      aiProcedural: 'AI: Thuật toán',
      aiGemini: 'AI: Gemini 2.5',
      trendsTooltipSimulated: 'Dữ liệu xu hướng mô phỏng (thêm YOUTUBE_API_KEY trong .env.local để lấy dữ liệu thực)',
      trendsTooltipLive: 'Đã kết nối YouTube Data API v3 trực tiếp',
      aiTooltipProcedural: 'Kịch bản thuật toán AI dự phòng (thêm GEMINI_API_KEY trong .env.local để dùng Gemini thực)',
      aiTooltipGemini: 'Đã kết nối trực tiếp Google Gemini 2.5',
    },
    filterBar: {
      nicheLabel: 'Chọn Chủ Đề Video Thiếu Nhi',
      trendWindowLabel: 'Khung Thời Gian',
      last24h: '24 giờ qua',
      past7Days: '7 ngày qua',
      conceptsLabel: 'Số Kịch Bản',
      conceptsCount: (c) => `${c} Kịch bản`,
      targetingPrefix: 'Đang nhắm đến:',
      scanTrendsBtn: 'Quét Xu Hướng',
      scanAndGenerateBtn: 'Quét Xu Hướng & Tạo Kịch Bản',
      harvestingAndGeneratingBtn: 'Đang quét & tạo kịch bản...',
    },
    categories: {
      animals: {
        label: 'Động Vật Đáng Yêu',
        description: 'Các bé thú con mũm mĩm với những hành động vụng về, hài hước và ngộ nghĩnh',
      },
      colors: {
        label: 'Nhận Biết Màu Sắc',
        description: 'Biến hình màu sắc sống động, bắn thạch rau câu và mở quà sắc màu',
      },
      vehicles: {
        label: 'Phương Tiện Ngộ Nghĩnh',
        description: 'Xe tải quái vật nhún nhảy, xe cứu hỏa mỉm cười và xe công trình vui nhộn',
      },
      nursery_fun: {
        label: 'Đồng Dao & Trò Chơi',
        description: 'Các vi hành động nhịp điệu bắt tai lấy cảm hứng từ nhạc đồng dao và trò ú òa',
      },
      surprises: {
        label: 'Trứng Bất Ngờ & Phép Thuật',
        description: 'Đập trứng đồ chơi sắc màu, mở hộp quà bí ẩn và nổ bong bóng lấp lánh',
      },
    },
    trendingPanel: {
      title: 'Phân Tích Xu Hướng',
      timeframeDay: '24h qua',
      timeframeWeek: '7 ngày qua',
      subtitle: 'Hashtag tăng trưởng cao & video mẫu nổi bật',
      copyAllTags: 'Sao chép tất cả thẻ',
      tagsCopied: 'Đã chép thẻ!',
      topHashtagsTitle: 'Top Hashtag Thịnh Hành Cao',
      clickToCopy: 'Bấm để sao chép',
      sensoryKeywordsTitle: 'Từ Khóa Kích Thích Giác Quan Hiệu Quả',
      benchmarkShortsTitle: 'Video Ngắn Tham Khảo Hàng Đầu',
      sortedByViews: 'Xếp theo lượt xem',
      emptyText: 'Bấm "Quét Xu Hướng & Tạo Kịch Bản" để phân tích các video ngắn đang hot.',
    },
    scriptCard: {
      sfxPrefix: 'Âm thanh:',
      copyBundle: 'Sao Chép Trọn Bộ Kịch Bản',
      bundleCopied: 'Đã sao chép bộ kịch bản!',
      timelineTitle: 'Dòng Thời Gian Vi Mô 5-7s (Pacing)',
      hookTitle: '0-2s Giữ Chân Tức Thì',
      hookBadge: 'Dừng lướt',
      actionTitle: '2-5s Hành Động Giác Quan',
      actionBadge: 'Tương tác',
      loopTitle: '5-7s Điểm Kết Vòng Lặp',
      loopBadge: 'Không vết nối',
      imagePromptTitle: 'Prompt Keyframe Midjourney / Flux (Phong cách Pixar 3D)',
      motionPromptTitle: 'Prompt Chuyển Động Kling / Runway Gen-3 / Pika (Vòng lặp)',
      copyImagePrompt: 'Chép Prompt Ảnh',
      copyMotionPrompt: 'Chép Prompt Chuyển Động',
      copyHashtags: 'Chép Hashtags',
      promptCopied: 'Đã chép Prompt!',
      tagsCopied: 'Đã chép Hashtags!',
      generateImageBtn: 'Tạo ảnh Preview mẫu',
      generatingImage: 'Đang vẽ ảnh...',
      regenerateImage: 'Tạo lại ảnh',
      downloadImage: 'Tải ảnh',
      previewBadge: 'Ảnh minh họa AI (9:16)',
      viewFullscreen: 'Xem phóng to',
      close: 'Đóng',
      youtubeSectionTitle: 'Thông Tin Đăng Tải YouTube (Title & Description)',
      youtubeTitleLabel: 'Tiêu đề video (Title)',
      youtubeDescLabel: 'Mô tả video (Description)',
      copyTitleBtn: 'Chép Tiêu Đề',
      copyDescBtn: 'Chép Mô Tả',
      titleCopied: 'Đã chép Tiêu đề!',
      descCopied: 'Đã chép Mô tả!',
    },
    dashboard: {
      scriptsSectionTitle: 'Ý Tưởng Kịch Bản & Prompt Tạo Video (5-7 Giây)',
      readyBadge: (count) => `${count} Kịch bản sẵn sàng`,
      scriptsSectionSubtitle: 'Vòng lặp hoàn hảo giữ chân người xem, tối ưu hóa cho Midjourney + Kling / Runway',
      copyAllConcepts: 'Sao Chép Tất Cả Kịch Bản',
      noScriptsTitle: 'Chưa có ý tưởng kịch bản nào',
      noScriptsText: 'Bấm "Quét Xu Hướng & Tạo Kịch Bản" để phân tích video xu hướng và tạo các prompt chuẩn Pixar 3D 5-7s.',
      generateNow: 'Tạo Kịch Bản Ngay',
      toastGenerated: (count) => `Đã tạo thành công ${count} kịch bản video ngắn!`,
      toastCopiedAll: 'Đã sao chép tất cả kịch bản vào bộ nhớ tạm!',
      toastCopiedTag: (tag) => `Đã sao chép thẻ ${tag}!`,
      toastSelectedTag: (tag) => `Đã chọn ${tag}`,
      toastCopyFailed: 'Không thể sao chép kịch bản vào bộ nhớ tạm',
      footerText: 'AI Kids Shorts Trend Harvester & Script Generator • Tối ưu hóa cho quy trình sản xuất video 5-7s Midjourney, Kling, Runway & Pika.',
    },
    common: {
      copy: 'Sao chép',
      copied: 'Đã chép!',
    },
  },
};


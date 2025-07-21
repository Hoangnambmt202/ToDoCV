// stores/ui.js
import { defineStore } from 'pinia'

export const useUIStore = defineStore('ui', {
  state: () => ({
    // Trạng thái hiển thị sidebar phải
    showRightSidebar: false,
    // Trạng thái hiển thị sidebar trái (nếu có)
    showLeftSidebar: false,
    // Trạng thái theme
    theme: 'light', // 'light' | 'dark'
    // Trạng thái loading global
    globalLoading: false,
    // Thông báo toast
    notifications: [],
    // Trạng thái modal
    modals: {
      deleteTask: false,
      addTask: false,
      editTask: false,
      settings: false
    },
    // Cấu hình view
    viewSettings: {
      tasksPerPage: 20,
      sortBy: 'created_at',
      sortOrder: 'desc', // 'asc' | 'desc'
      filterStatus: 'all', // 'all' | 'pending' | 'completed'
      viewMode: 'list' // 'list' | 'grid' | 'kanban'
    },
    // Trạng thái search
    searchQuery: '',
    // Trạng thái responsive
    isMobile: false,
    isTablet: false,
    // Trạng thái sidebar collapsed
    sidebarCollapsed: false
  }),

  getters: {
    // Kiểm tra theme hiện tại
    isDarkMode: (state) => state.theme === 'dark',
    
    // Kiểm tra có notification nào không
    hasNotifications: (state) => state.notifications.length > 0,
    
    // Lấy notification mới nhất
    latestNotification: (state) => {
      return state.notifications.length > 0 ? state.notifications[0] : null
    },
    
    // Kiểm tra có modal nào đang mở không
    hasOpenModal: (state) => {
      return Object.values(state.modals).some(isOpen => isOpen)
    },
    
    // Kiểm tra responsive
    isDesktop: (state) => !state.isMobile && !state.isTablet,
    
    // Lấy class cho responsive
    responsiveClass: (state) => {
      if (state.isMobile) return 'mobile'
      if (state.isTablet) return 'tablet'
      return 'desktop'
    }
  },

  actions: {
    // 1. Toggle right sidebar
    toggleRightSidebar() {
      this.showRightSidebar = !this.showRightSidebar
    },

    // 2. Mở right sidebar
    openRightSidebar() {
      this.showRightSidebar = true
    },

    // 3. Đóng right sidebar
    closeRightSidebar() {
      this.showRightSidebar = false
    },

    // 4. Toggle left sidebar
    toggleLeftSidebar() {
      this.showLeftSidebar = !this.showLeftSidebar
    },

    // 5. Toggle theme
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
      this.persistTheme()
    },

    // 6. Set theme cụ thể
    setTheme(theme) {
      if (['light', 'dark'].includes(theme)) {
        this.theme = theme
        this.persistTheme()
      }
    },

    // 7. Persist theme vào localStorage
    persistTheme() {
      try {
        localStorage.setItem('theme', this.theme)
        // Áp dụng theme vào document
        document.documentElement.classList.toggle('dark', this.theme === 'dark')
      } catch (error) {
        console.warn('Cannot persist theme to localStorage:', error)
      }
    },

    // 8. Load theme từ localStorage
    loadTheme() {
      try {
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
          this.theme = savedTheme
          document.documentElement.classList.toggle('dark', this.theme === 'dark')
        }
      } catch (error) {
        console.warn('Cannot load theme from localStorage:', error)
      }
    },

    // 9. Thêm notification
    addNotification(notification) {
      const id = Date.now() + Math.random()
      const newNotification = {
        id,
        type: 'info', // 'success' | 'error' | 'warning' | 'info'
        title: '',
        message: '',
        duration: 5000,
        ...notification
      }
      
      this.notifications.unshift(newNotification)
      
      // Tự động xóa notification sau duration
      if (newNotification.duration > 0) {
        setTimeout(() => {
          this.removeNotification(id)
        }, newNotification.duration)
      }
      
      return id
    },

    // 10. Xóa notification
    removeNotification(id) {
      this.notifications = this.notifications.filter(n => n.id !== id)
    },

    // 11. Xóa tất cả notifications
    clearNotifications() {
      this.notifications = []
    },

    // 12. Mở modal
    openModal(modalName) {
      if (this.modals.hasOwnProperty(modalName)) {
        this.modals[modalName] = true
      }
    },

    // 13. Đóng modal
    closeModal(modalName) {
      if (this.modals.hasOwnProperty(modalName)) {
        this.modals[modalName] = false
      }
    },

    // 14. Đóng tất cả modals
    closeAllModals() {
      Object.keys(this.modals).forEach(key => {
        this.modals[key] = false
      })
    },

    // 15. Toggle modal
    toggleModal(modalName) {
      if (this.modals.hasOwnProperty(modalName)) {
        this.modals[modalName] = !this.modals[modalName]
      }
    },

    // 16. Cập nhật view settings
    updateViewSettings(settings) {
      this.viewSettings = { ...this.viewSettings, ...settings }
      this.persistViewSettings()
    },

    // 17. Persist view settings
    persistViewSettings() {
      try {
        localStorage.setItem('viewSettings', JSON.stringify(this.viewSettings))
      } catch (error) {
        console.warn('Cannot persist view settings:', error)
      }
    },

    // 18. Load view settings
    loadViewSettings() {
      try {
        const saved = localStorage.getItem('viewSettings')
        if (saved) {
          this.viewSettings = { ...this.viewSettings, ...JSON.parse(saved) }
        }
      } catch (error) {
        console.warn('Cannot load view settings:', error)
      }
    },

    // 19. Set search query
    setSearchQuery(query) {
      this.searchQuery = query
    },

    // 20. Clear search
    clearSearch() {
      this.searchQuery = ''
    },

    // 21. Set global loading
    setGlobalLoading(loading) {
      this.globalLoading = loading
    },

    // 22. Set responsive state
    setResponsiveState(breakpoint) {
      this.isMobile = breakpoint === 'mobile'
      this.isTablet = breakpoint === 'tablet'
    },

    // 23. Toggle sidebar collapsed
    toggleSidebarCollapsed() {
      this.sidebarCollapsed = !this.sidebarCollapsed
    },

    // 24. Khởi tạo UI store
    initializeUI() {
      this.loadTheme()
      this.loadViewSettings()
      this.setupResponsiveListener()
    },

    // 25. Setup responsive listener
    setupResponsiveListener() {
      if (typeof window !== 'undefined') {
        const updateBreakpoint = () => {
          const width = window.innerWidth
          if (width < 768) {
            this.setResponsiveState('mobile')
          } else if (width < 1024) {
            this.setResponsiveState('tablet')
          } else {
            this.setResponsiveState('desktop')
          }
        }
        
        updateBreakpoint()
        window.addEventListener('resize', updateBreakpoint)
      }
    },

    // 26. Show success notification
    showSuccess(message, title = 'Thành công') {
      return this.addNotification({
        type: 'success',
        title,
        message,
        duration: 3000
      })
    },

    // 27. Show error notification
    showError(message, title = 'Lỗi') {
      return this.addNotification({
        type: 'error',
        title,
        message,
        duration: 5000
      })
    },

    // 28. Show warning notification
    showWarning(message, title = 'Cảnh báo') {
      return this.addNotification({
        type: 'warning',
        title,
        message,
        duration: 4000
      })
    },

    // 29. Show info notification
    showInfo(message, title = 'Thông tin') {
      return this.addNotification({
        type: 'info',
        title,
        message,
        duration: 3000
      })
    }
  }
})
import { observable, computed, action } from 'mobx';
import userStore from './userStore';
import loadingStore from './loadingStore';
import { ToastStyles } from 'react-native-toaster'
import { AsyncStorage } from 'react-native';
import config from '../config';
import Storage from "react-native-storage";

const storage = new Storage({
  size: 1000,
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: true,
});

class RootStore {
  constructor() {
    this.UserStore = new UserStore(userStore, this);
    this.LoadingStore = new LoadingStore(loadingStore, this);
    this.StorageStore = new StorageStore;
  }
}

class StorageStore {
  @observable
  allData = {};

  constructor(data, rootStore) {
    this.allData = data;
    this.rootStore = rootStore;
  }

  @action
  async save(key, data) {
    return await storage.save({ key, data });
  }

  @action
  static async load(key) {
    return await storage.load({ key });
  }

  @action
  static async remove(key) {
    return await storage.remove({ key });
  }
}

class UserStore {
  @observable
  allData = {};

  constructor(data, rootStore) {
    this.allData = data;
    this.rootStore = rootStore;
  }

  // 弹出提示信息
  @action
  toast(type, text) {
    this.allData.toastMessage = {
      text,
      styles: ToastStyles[type],
      duration: 1500,
    };
  }

  // 清空提示信息
  @action
  clearToast() {
    this.allData.toastMessage = null;
  }

  // 登录
  @action
  async login(username, password) {
    const Uri = `${config.domain}/api/user/login`;
    const Header = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      })
    };
    try {
      const response = await fetch(Uri, Header);
      return await response.json();
    } catch (err) {
      await this.toast('error', '登录失败');
      await this.clearToast();
    }
  }

  // 课程
  @action
  async course(year, semester, token) {
    const Uri = `${config.domain}/api/user/course`;
    const Header = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        year,
        semester
      })
    };
    try {
      const response = await fetch(Uri, Header);
      return await response.json();
    } catch (err) {
      await this.toast('error', '拉取课程信息失败');
      await this.clearToast();
    }
  }

  // 考试
  async exam(year, semester, token) {
    const Uri = `${config.domain}/api/user/exam`;
    const Header = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        year,
        semester
      })
    };
    try {
      const response = await fetch(Uri, Header);
      return await response.json();
    } catch (err) {
      await this.toast('error', '拉取考试安排信息失败');
      await this.clearToast();
    }
  }

  // 学期成绩
  async grade(year, semester, token) {
    const Uri = `${config.domain}/api/user/grade`;
    const Header = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        year,
        semester
      })
    };
    try {
      const response = await fetch(Uri, Header);
      return await response.json();
    } catch (err) {
      await this.toast('error', '拉取成绩信息失败');
      await this.clearToast();
    }
  }
}

class LoadingStore {
  @observable
  allData = {};

  constructor(data, rootStore) {
    this.allData = data;
    this.rootStore = rootStore;
  }

  @action
  loading(loadingVisible, loadingText) {
    this.allData.loadingVisible = loadingVisible;
    this.allData.loadingText = loadingText;
  }
}


export default new RootStore();

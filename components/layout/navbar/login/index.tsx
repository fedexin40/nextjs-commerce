'use client';

import { TasksProvider } from '../context';
import LoginMenu from './login';

export default function Login() {
  return (
    <TasksProvider>
      <LoginMenu />
    </TasksProvider>
  );
}

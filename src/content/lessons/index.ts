/**
 * Central lesson registry — all BlockLesson content keyed by slug.
 */
import type { BlockLesson } from "../lessonTypes";
import { moduleALessons } from "./moduleA";
import { moduleBLessons } from "./moduleB";
import { moduleCLessons } from "./moduleC";
import { moduleDLessons } from "./moduleD";
import { moduleELessons } from "./moduleE";
import { moduleFLessons } from "./moduleF";
import { moduleGLessons } from "./moduleG";

export * from "./moduleA";
export * from "./moduleB";
export * from "./moduleC";
export * from "./moduleD";
export * from "./moduleE";
export * from "./moduleF";
export * from "./moduleG";

/** All lessons from all modules */
export const ALL_LESSONS: BlockLesson[] = [
  ...moduleALessons,
  ...moduleBLessons,
  ...moduleCLessons,
  ...moduleDLessons,
  ...moduleELessons,
  ...moduleFLessons,
  ...moduleGLessons,
];

/** Lesson registry keyed by slug */
export const BLOCK_LESSON_REGISTRY: Record<string, BlockLesson> = Object.fromEntries(
  ALL_LESSONS.map((lesson) => [lesson.slug, lesson]),
);

/** Lookup a lesson by slug */
export function getBlockLesson(slug: string): BlockLesson | undefined {
  return BLOCK_LESSON_REGISTRY[slug];
}

/** All lessons belonging to a module */
export function getLessonsByModule(module: string): BlockLesson[] {
  return ALL_LESSONS.filter((l) => l.module === module);
}

/** All lessons matching a tag */
export function getLessonsByTag(tag: string): BlockLesson[] {
  return ALL_LESSONS.filter((l) => l.tags.includes(tag));
}

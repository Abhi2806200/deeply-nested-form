'use client'

import { FormTypeCreateCourse, useFormContextCreateCourse } from "@/forms"
import { useState } from "react"
import { useFieldArray } from "react-hook-form"

export const NewCourse = () => {
    const {
        register,
        formState: { errors },
        watch,
        handleSubmit,
        reset, // Add reset to clear form after submission
    } = useFormContextCreateCourse();

    const formData = watch();
    const [dataChapter, setDataChapter] = useState<FormTypeCreateCourse | null>(null);

    const onSubmit = (data: FormTypeCreateCourse) => {
        console.log("data", data);
        setDataChapter(data);  // Correctly set form data after successful submission
        reset(); // Optionally clear form after submission
    };

    return (
        <div>
            <div className='p-6 bg-gray-300 shadow-sm rounded-lg'>
                <div className="text-xl mb-2 font-bold">New Course</div>
                <form className="space-y-3"
                    onSubmit={handleSubmit(onSubmit)} // Use `onSubmit` function to handle data
                >
                    <label title="Title">
                        <div className="mb-1">Title</div>
                        <input
                            placeholder="Enter Course Title"
                            className="border-2 border-grey-600 rounded-lg px-2 py-1 bg-transparent"
                            {...register('title')}
                        />
                        <div className="text-red-600 text-sm mt-1">
                            {errors?.title?.message}
                        </div>
                    </label>

                    <ManageChapters />

                    <div className="text-red-600 text-sm mt-1">
                        {errors?.chapters?.message}
                    </div>
                    
                    <button className="px-4 py-2 bg-blue-600 rounded-lg text-white" type="submit">
                        Submit
                    </button>
                </form>
            </div>

            {/* Display data after form submission */}
            <DisplayList dataChapter={dataChapter} />
        </div>
    );
};

const ManageChapters = () => {
    const { register, control, formState: { errors } } = useFormContextCreateCourse();
    const { append, remove, fields } = useFieldArray({ name: 'chapters', control });

    return (
        <div className="space-y-4">
            {fields.map((chapter, chapterIndex) => (
                <div key={chapter.id} className="p-6 bg-gray-200 shadow-lg rounded-lg space-y-3">
                    <div className="flex justify-between">
                        <div className="text-lg mb-2 font-semibold">Chapters</div>
                        <button
                            type="button"
                            onClick={() => remove(chapterIndex)}
                            className="text-red-400 text-xs underline underline-offset-4"
                        >
                            Remove Chapter
                        </button>
                    </div>

                    <label title="Title">
                        <div className="mb-1">Chapter title</div>
                        <input
                            {...register(`chapters.${chapterIndex}.title`)}
                            className="border-2 border-gray-600 rounded-lg px-2 py-1 bg-transparent"
                            placeholder="Enter Chapter Title"
                        />
                        <div className="text-red-600">
                            {errors?.chapters?.[chapterIndex]?.title?.message}
                        </div>
                    </label>

                    <ManageNotes chapterIndex={chapterIndex} />
                </div>
            ))}

            <button
                type="button"
                onClick={() => append({ title: '', notes: [] })}
                className="text-gray-600 text-center w-full underline underline-offset-4 py-2"
            >
                Add Chapter
            </button>
        </div>
    );
};

const ManageNotes = ({ chapterIndex }: { chapterIndex: number }) => {
    const { register, control, formState: { errors } } = useFormContextCreateCourse();
    const { append, remove, fields } = useFieldArray({ name: `chapters.${chapterIndex}.notes`, control });

    return (
        <div className="space-y-4">
            {fields.map((note, noteIndex) => (
                <div key={note?.id} className="py-4 bg-white p-6 rounded-lg shadow-xl">
                    <div>
                        <div className="flex justify-between">
                            <div className="mb-2 font-semibold">Note</div>
                            <button
                                type="button"
                                onClick={() => remove(noteIndex)}
                                className="text-red-400 text-xs underline underline-offset-4"
                            >
                                Remove note
                            </button>
                        </div>

                        <label title={"Title"} className="inline-block">
                            <div className="mb-1">Content</div>
                            <input
                                placeholder="Enter note"
                                className="border-2 border-grey-600 rounded-lg px-2 py-1 bg-transparent"
                                {...register(`chapters.${chapterIndex}.notes.${noteIndex}.content`)}
                            />
                            <div className="text-red-600">
                                {errors.chapters?.[chapterIndex]?.notes?.[noteIndex]?.content?.message}
                            </div>
                        </label>
                    </div>
                </div>
            ))}

            <button
                type="button"
                onClick={() => append({ content: '' })}
                className="text-grey-600 text-center w-full underline underline-offset-4 py-2"
            >
                Add Note
            </button>
        </div>
    );
};

const DisplayList = ({ dataChapter }: { dataChapter: any }) => {
    if (!dataChapter) {
        return null; // Return null if no dataChapter
    }

    return (
        <div className="p-6 bg-gray-300 shadow-sm rounded-lg">
            <div className="text-xl mb-2 font-bold">{dataChapter?.title}</div>
            <ul className="space-y-4">
                {dataChapter?.chapters?.map((chapter: any, chapterIndex: any) => (
                    <li key={chapterIndex} className="p-4 bg-gray-200 shadow-lg rounded-lg">
                        <div className="font-semibold">Chapter {chapterIndex + 1}: {chapter.title}</div>
                        <ul className="list-disc pl-6">
                            {chapter.notes?.map((note: any, noteIndex: any) => (
                                <li key={noteIndex} className="text-gray-700">
                                    {note.content}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

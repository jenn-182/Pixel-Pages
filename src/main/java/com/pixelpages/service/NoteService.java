package com.pixelpages.service;

import com.pixelpages.model.Note;
import com.pixelpages.storage.NoteStorage;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class NoteService {
    private final NoteStorage noteStorage;

    public NoteService() {
        this.noteStorage = new NoteStorage("pixel_pages_notes");
    }

    public List<Note> getAllNotes() throws IOException {
        List<Note> notes = noteStorage.listAllNotes();

        for (Note note : notes) {
            if (note.getFilename() == null) {
                String filename = noteStorage.generateUniqueFilename(note.getTitle());
                note.setFilename(filename);
            }
        }

        return notes;
    }

    public Optional<Note> getNoteById(String filename) throws IOException {
        try {
            Note note = noteStorage.readNote(filename);
            return Optional.of(note);
        } catch (IOException e) {
            return Optional.empty();
        }
    }

    public Note createNote(Note note) throws IOException {
        String filename = noteStorage.generateUniqueFilename(note.getTitle());
        noteStorage.saveNote(note, filename);

        // Set the filename on the note object before returning
        note.setFilename(filename); // Make sure your Note class has this setter
        return note;
    }

    public Note updateNote(String filename, Note updatedNote) throws IOException {
        noteStorage.saveNote(updatedNote, filename);
        return updatedNote;
    }

    public boolean deleteNote(String filename) throws IOException {
        if (filename == null || filename.trim().isEmpty()) {
            return false;
        }

        try {
            noteStorage.deleteNote(filename);
            return true;
        } catch (IOException e) {
            System.err.println("Failed to delete note: " + filename + " - " + e.getMessage());
            return false;
        }
    }

    public List<Note> searchNotes(String query) throws IOException {
        List<Note> allNotes = getAllNotes();
        return allNotes.stream()
                .filter(note ->
                        note.getTitle().toLowerCase().contains(query.toLowerCase()) ||
                                note.getContent().toLowerCase().contains(query.toLowerCase()) ||
                                note.getTags().stream().anyMatch(tag -> tag.toLowerCase().contains(query.toLowerCase()))
                )
                .collect(Collectors.toList());
    }
}

/* eslint-disable no-underscore-dangle */

class NotesHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    this.postNoteHandler = this.postNoteHandler.bind(this);
    this.getNotesHandler = this.getNotesHandler.bind(this);
    this.getNoteByIdHandler = this.getNoteByIdHandler.bind(this);
    this.putNoteByIdHandler = this.putNoteByIdHandler.bind(this);
    this.deleteNoteByIdHandler = this.deleteNoteByIdHandler.bind(this);
  }

  async postNoteHandler(request, h) {
    this.validator.validateNotePayload(request.payload);
    const { title = 'untitled', body, tags } = request.payload;

    const noteId = await this.service.addNote({ title, body, tags });

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil ditambahkan',
      data: {
        noteId,
      },
    });

    response.code(201);
    return response;
  }

  async getNotesHandler(request, h) {
    const notes = await this.service.getNotes();

    const response = h.response({
      status: 'success',
      data: {
        notes,
      },
    });

    response.code(200);
    return response;
  }

  async getNoteByIdHandler(request, h) {
    const { id } = request.params;
    const note = await this.service.getNoteById(id);

    const response = h.response({
      status: 'success',
      data: {
        note,
      },
    });

    response.code(200);
    return response;
  }

  async putNoteByIdHandler(request, h) {
    this.validator.validateNotePayload(request.payload);
    const { id } = request.params;

    await this.service.editNoteById(id, request.payload);

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil diperbarui',
    });

    response.code(200);
    return response;
  }

  async deleteNoteByIdHandler(request, h) {
    const { id } = request.params;
    await this.service.deleteNoteById(id);

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });

    response.code(200);
    return response;
  }
}

module.exports = NotesHandler;

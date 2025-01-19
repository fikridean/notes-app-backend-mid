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
    const { id: credentialId } = request.auth.credentials;

    const noteId = await this.service.addNote(title, body, tags, credentialId);

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
    const { id: credentialId } = request.auth.credentials;
    const notes = await this.service.getNotes(credentialId);

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
    const { id: credentialId } = request.auth.credentials;

    await this.service.verifyNoteAccess(id, credentialId);
    const note = await this.service.getNoteById(id, credentialId);

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
    const { id: credentialId } = request.auth.credentials;

    await this.service.verifyNoteAccess(id, credentialId);
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
    const { id: credentialId } = request.auth.credentials;

    await this.service.verifyNoteOwner(id, credentialId);
    await this.service.deleteNoteById(id, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Catatan berhasil dihapus',
    });

    response.code(200);
    return response;
  }
}

module.exports = NotesHandler;

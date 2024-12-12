import { TestBed, waitForAsync } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { DatabaseService } from './database.service';
import { User } from '../model/user';

describe('AuthService', () => {
  let service: AuthService;
  let routerSpy: jasmine.SpyObj<Router>;
  let storageSpy: jasmine.SpyObj<Storage>;
  let dbServiceSpy: jasmine.SpyObj<DatabaseService>;

  beforeEach(waitForAsync(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const storageSpyObj = jasmine.createSpyObj('Storage', ['get', 'set', 'remove', 'create']);
    const dbServiceSpyObj = jasmine.createSpyObj('DatabaseService', ['findUser']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpyObj },
        { provide: Storage, useValue: storageSpyObj },
        { provide: DatabaseService, useValue: dbServiceSpyObj }
      ]
    });

    service = TestBed.inject(AuthService);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    storageSpy = TestBed.inject(Storage) as jasmine.SpyObj<Storage>;
    dbServiceSpy = TestBed.inject(DatabaseService) as jasmine.SpyObj<DatabaseService>;
  }));

  // Simular un Storage mínimo para pruebas
  const storageMock: any = {
    create: jasmine.createSpy('create').and.returnValue(Promise.resolve()),
    get: jasmine.createSpy('get').and.returnValue(Promise.resolve(null)),
    set: jasmine.createSpy('set').and.returnValue(Promise.resolve()),
    remove: jasmine.createSpy('remove').and.returnValue(Promise.resolve()),
    _config: {},
    _db: {},
    _secureStorageDriver: {},
    defineDriver: jasmine.createSpy('defineDriver'),
    ready: jasmine.createSpy('ready').and.returnValue(Promise.resolve()),
    createDriver: jasmine.createSpy('createDriver'),
    setDriver: jasmine.createSpy('setDriver'),
    driver: 'driver', // Simular el driver
    assertDb: jasmine.createSpy('assertDb').and.returnValue(Promise.resolve()), // Añadir assertDb
    clear: jasmine.createSpy('clear').and.returnValue(Promise.resolve()), // Añadir clear
    length: 0, // Añadir length
  };

  // Test 1: Verificar creación del servicio
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test 2: Verificar inicialización del storage
  it('should initialize storage on initializeAuthService', waitForAsync(() => {
    storageSpy.create.and.returnValue(Promise.resolve(storageMock));
    service.initializeAuthService().then(() => {
      expect(storageSpy.create).toHaveBeenCalled();
    });
  }));

  // Test 3: Verificar autenticación con usuario existente
  it('should return true for isAuthenticated when user exists', waitForAsync(() => {
    const mockUser = new User();
    storageSpy.get.and.returnValue(Promise.resolve(mockUser));
    service.isAuthenticated().then((result) => {
      expect(result).toBe(true);
    });
  }));

  // Test 4: Verificar autenticación sin usuario
  it('should return false for isAuthenticated when no user exists', waitForAsync(() => {
    storageSpy.get.and.returnValue(Promise.resolve(null));
    service.isAuthenticated().then((result) => {
      expect(result).toBe(false);
    });
  }));

  // Test 5: Verificar login exitoso
  it('should successfully log in with valid credentials', waitForAsync(() => {
    const mockUser = new User();
    dbServiceSpy.findUser.and.returnValue(Promise.resolve(mockUser));
    storageSpy.set.and.returnValue(Promise.resolve());

    service.login('testUser', 'testPass').then((result) => {
      expect(result).toBe(true);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/home']);
    });
  }));

  // Test 6: Verificar login fallido
  it('should fail login with invalid credentials', waitForAsync(() => {
    dbServiceSpy.findUser.and.returnValue(Promise.resolve(undefined));
    service.login('wrongUser', 'wrongPass').then((result) => {
      expect(result).toBe(false);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  }));
});

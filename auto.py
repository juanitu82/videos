import os
import re
import json
import subprocess
from datetime import datetime
from pathlib import Path

# ==================== CONFIGURACIÓN ====================

# Rutas de las carpetas en red
CARPETA_COLEGIALAS = r"Y:\Nueva carpeta\Nueva carpeta\jav\Nueva carpeta\colegialas"  # Cambia por tu ruta real
CARPETA_OTRAS = r"Y:\Nueva carpeta\Nueva carpeta\jav\Nueva carpeta\colegialas\otras"           # Cambia por tu ruta real

# Ruta local del repositorio de GitHub
REPO_PATH = r"D:\apps-dev\videos"  # Cambia por tu ruta real

# Nombres de los archivos JSON
JSON_COLEGIALAS = "colegialas.json"
JSON_OTRAS = "otras.json"

# Regex para normalizar títulos
PATRON = re.compile(r"^([A-Za-z]{2,5})-(\d{1,3})")

# ==================== FUNCIONES ====================

def normalizar_carpeta(carpeta_path):
    """
    Normaliza los nombres de archivos de una carpeta y retorna lista de objetos.
    Solo procesa archivos directamente en la carpeta (no recursivo).
    """
    resultados = []
    vistos = set()
    
    if not os.path.exists(carpeta_path):
        print(f"⚠️  Carpeta no encontrada: {carpeta_path}")
        return resultados
    
    print(f"📂 Procesando: {carpeta_path}")
    
    for archivo in os.listdir(carpeta_path):
        ruta_completa = os.path.join(carpeta_path, archivo)
        
        # Solo procesar archivos, ignorar carpetas (como "otras" dentro de colegialas)
        if not os.path.isfile(ruta_completa):
            continue
        
        nombre, _ = os.path.splitext(archivo)
        match = PATRON.match(nombre)
        
        if match:
            codigo = match.group(1).upper()
            numero = int(match.group(2))
            numero_norm = f"{numero:03d}"
            title = f"{codigo}-{numero_norm}"
            
            if title not in vistos:
                resultados.append({"title": title})
                vistos.add(title)
    
    print(f"   ✓ Encontrados {len(resultados)} archivos únicos")
    return resultados


def leer_json_actual(json_path):
    """
    Lee el JSON actual del repositorio. Si no existe, retorna lista vacía.
    """
    if os.path.exists(json_path):
        try:
            with open(json_path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"⚠️  Error leyendo {json_path}: {e}")
    return []


def guardar_json(data, json_path):
    """
    Guarda los datos en formato JSON ordenado alfabéticamente.
    """
    # Ordenar por title para mejor legibilidad
    data_ordenada = sorted(data, key=lambda x: x["title"])
    
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data_ordenada, f, indent=2, ensure_ascii=False)
    
    print(f"💾 Guardado: {json_path}")


def hay_cambios(data_nueva, data_actual):
    """
    Compara dos listas de objetos para ver si hay diferencias.
    """
    # Ordenar ambas listas para comparación justa
    nueva_ordenada = sorted(data_nueva, key=lambda x: x["title"])
    actual_ordenada = sorted(data_actual, key=lambda x: x["title"])
    
    return nueva_ordenada != actual_ordenada


def git_commit_push(mensaje):
    """
    Hace commit y push de los cambios al repositorio.
    """
    try:
        # Agregar archivos modificados
        subprocess.run(["git", "add", "*.json"], cwd=REPO_PATH, check=True)
        
        # Commit
        subprocess.run(
            ["git", "commit", "-m", mensaje],
            cwd=REPO_PATH,
            check=True
        )
        
        # Push
        subprocess.run(["git", "push"], cwd=REPO_PATH, check=True)
        
        print("✅ Cambios subidos a GitHub exitosamente")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ Error en Git: {e}")
        return False


def git_pull():
    """
    Hace pull del repositorio para obtener la última versión desde GitHub.
    """
    try:
        subprocess.run(["git", "pull"], cwd=REPO_PATH, check=True, capture_output=True)
        print("✓ Repositorio actualizado desde GitHub")
        return True
    except subprocess.CalledProcessError as e:
        print(f"⚠️  Error al hacer pull: {e}")
        print("   Continuando con versión local...")
        return False


def main():
    """
    Función principal que orquesta todo el proceso.
    """
    print("=" * 60)
    print(f"🚀 Iniciando actualización automática - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 60)
    
    # Actualizar desde GitHub primero
    print("\n0️⃣  SINCRONIZANDO CON GITHUB")
    print("-" * 60)
    git_pull()
    
    # Procesar colegialas
    print("\n1️⃣  PROCESANDO COLEGIALAS")
    print("-" * 60)
    data_colegialas = normalizar_carpeta(CARPETA_COLEGIALAS)
    
    # Procesar otras
    print("\n2️⃣  PROCESANDO OTRAS")
    print("-" * 60)
    data_otras = normalizar_carpeta(CARPETA_OTRAS)
    
    # Verificar si hay datos
    if not data_colegialas and not data_otras:
        print("\n⚠️  No se encontraron archivos para procesar. Abortando.")
        return
    
    # Rutas completas de los JSON en el repo
    json_colegialas_path = os.path.join(REPO_PATH, JSON_COLEGIALAS)
    json_otras_path = os.path.join(REPO_PATH, JSON_OTRAS)
    
    # Leer JSONs actuales
    print("\n3️⃣  COMPARANDO CON VERSIONES ACTUALES")
    print("-" * 60)
    actual_colegialas = leer_json_actual(json_colegialas_path)
    actual_otras = leer_json_actual(json_otras_path)
    
    # Detectar cambios
    cambios_colegialas = hay_cambios(data_colegialas, actual_colegialas)
    cambios_otras = hay_cambios(data_otras, actual_otras)
    
    if not cambios_colegialas and not cambios_otras:
        print("✓ No hay cambios detectados. Todo está actualizado.")
        return
    
    # Guardar JSONs
    print("\n4️⃣  GUARDANDO CAMBIOS")
    print("-" * 60)
    
    archivos_modificados = []
    
    if cambios_colegialas:
        guardar_json(data_colegialas, json_colegialas_path)
        archivos_modificados.append("colegialas.json")
        print(f"   • colegialas: {len(actual_colegialas)} → {len(data_colegialas)} archivos")
    
    if cambios_otras:
        guardar_json(data_otras, json_otras_path)
        archivos_modificados.append("otras.json")
        print(f"   • otras: {len(actual_otras)} → {len(data_otras)} archivos")
    
    # Subir a GitHub
    print("\n5️⃣  SUBIENDO A GITHUB")
    print("-" * 60)
    
    mensaje_commit = f"Auto-update: {', '.join(archivos_modificados)} - {datetime.now().strftime('%Y-%m-%d %H:%M')}"
    
    if git_commit_push(mensaje_commit):
        print(f"\n🎉 Proceso completado exitosamente")
        print(f"   Archivos actualizados: {', '.join(archivos_modificados)}")
    else:
        print("\n⚠️  El proceso completó pero hubo problemas al subir a GitHub")
    
    print("\n" + "=" * 60)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"\n❌ Error inesperado: {e}")
        import traceback
        traceback.print_exc()